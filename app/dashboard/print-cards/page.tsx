"use client"
import { useState, useEffect, useRef, useMemo, type ReactNode } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import QRCodeGenerator from 'qrcode'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import BrandLogo from '@/components/BrandLogo'
import AuthThemeToggle from '@/components/AuthThemeToggle'

const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }
    return entities[char]
  })

const compressCardBackground = async (file: File): Promise<string> => {
  if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) throw new Error('اختر صورة JPG أو PNG أو WEBP.')
  if (file.size > 8 * 1024 * 1024) throw new Error('حجم الصورة الأصلية يجب ألا يتجاوز 8 ميجابايت.')
  const objectUrl = URL.createObjectURL(file)
  try {
    const image = new Image()
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve()
      image.onerror = () => reject(new Error('تعذر قراءة الصورة المحددة.'))
      image.src = objectUrl
    })
    let scale = Math.min(1, 1200 / image.naturalWidth, 760 / image.naturalHeight)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('تعذر تجهيز الصورة للمعاينة.')
    for (let attempt = 0; attempt < 5; attempt++) {
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', attempt < 2 ? 0.68 : 0.56))
      if (blob && blob.size <= 135 * 1024) {
        return await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('تعذر تجهيز ملف الصورة.'))
          reader.onerror = () => reject(new Error('تعذر قراءة الصورة المضغوطة.'))
          reader.readAsDataURL(blob)
        })
      }
      scale *= 0.78
    }
    throw new Error('الصورة كبيرة بعد الضغط. اختر صورة أبسط أو أصغر.')
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

const createBatchIdempotencyKey = (): string => {
  if (typeof crypto === 'undefined' || !crypto.getRandomValues) {
    throw new Error('Secure random generator is unavailable')
  }

  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)

  // UUID v4
  bytes[6] = (bytes[6] & 0x0f) | 0x40
  bytes[8] = (bytes[8] & 0x3f) | 0x80

  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, '0')
  ).join('')

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join('-')
}


const DEFAULT_TEXT_STYLES = {
  network: { show: true, fontSize: 20, color: '#ffffff', fontFamily: 'default', position: 'top', align: 'center', borderWidth: 0, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
  username: { show: true, fontSize: 22, color: '#FFD700', fontFamily: 'default', position: 'center', align: 'center', borderWidth: 0, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
  validity: { show: true, fontSize: 11, color: '#ffffff', fontFamily: 'default', position: 'bottom', align: 'center', borderWidth: 0, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
  time: { show: true, fontSize: 11, color: '#ffffff', fontFamily: 'default', position: 'bottom', align: 'center', borderWidth: 0, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
  data: { show: true, fontSize: 11, color: '#ffffff', fontFamily: 'default', position: 'bottom', align: 'center', borderWidth: 0, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
  price: { show: true, fontSize: 11, color: '#ffffff', fontFamily: 'default', position: 'bottom', align: 'center', borderWidth: 0, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
  distributor: { show: true, fontSize: 10, color: '#e0e0e0', fontFamily: 'default', position: 'bottom', align: 'center', borderWidth: 0, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
  offer: { show: true, fontSize: 11, color: '#ffffff', fontFamily: 'default', position: 'bottom', align: 'center', borderWidth: 0, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
  recharge: { show: true, fontSize: 10, color: '#ffffff', fontFamily: 'default', position: 'right', align: 'center', borderWidth: 0, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
  customMessage: { show: false, fontSize: 12, color: '#FFD700', fontFamily: 'default', position: 'bottom', align: 'center', borderWidth: 1, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
  warning: { show: true, fontSize: 10, color: '#e0e0e0', fontFamily: 'default', position: 'bottom', align: 'center', borderWidth: 0, borderColor: '#FFD700', borderStyle: 'solid', background: 'transparent' },
};

const CARD_DESIGN_TEMPLATES = [
  { id: 'royal-blue', name: 'الأزرق الملكي', note: 'أزرق عميق ولمسات ذهبية', cardStyle: 'colored', colorScheme: 'blue-gold', cardEffect: 'gradient', cardShape: 'rectangle', borderWidth: 2, borderColor: '#f7d77a', accent: '#f7d77a', textColor: '#fffaf0', fontFamily: 'kufi' },
  { id: 'emerald-gold', name: 'زمرد وذهب', note: 'أخضر راقٍ وهوية دافئة', cardStyle: 'colored', colorScheme: 'green-gold', cardEffect: '3d', cardShape: 'square', borderWidth: 2, borderColor: '#facc15', accent: '#facc15', textColor: '#ffffff', fontFamily: 'arabic' },
  { id: 'purple-silver', name: 'بنفسجي فضي', note: 'طابع عصري هادئ', cardStyle: 'colored', colorScheme: 'purple-silver', cardEffect: 'gradient', cardShape: 'square', borderWidth: 2, borderColor: '#c0c0c0', accent: '#e5e7eb', textColor: '#ffffff', fontFamily: 'sans' },
  { id: 'midnight-gold', name: 'أسود وذهبي', note: 'مظهر فاخر بتباين قوي', cardStyle: 'colored', colorScheme: 'black-gold', cardEffect: 'glow', cardShape: 'rectangle', borderWidth: 2, borderColor: '#facc15', accent: '#facc15', textColor: '#fff7d6', fontFamily: 'serif' },
  { id: 'sky-minimal', name: 'سماء هادئة', note: 'مساحة بيضاء وأزرق واضح', cardStyle: 'three-color', colorScheme: 'white-blue', cardEffect: 'gradient', cardShape: 'square', borderWidth: 1, borderColor: '#60a5fa', accent: '#2563eb', textColor: '#172033', fontFamily: 'system' },
  { id: 'classic-clean', name: 'كلاسيكي بسيط', note: 'اقتصادي وواضح للطباعة', cardStyle: 'plain', colorScheme: 'blue-gold', cardEffect: 'plain', cardShape: 'rectangle', borderWidth: 1, borderColor: '#9ca3af', accent: '#374151', textColor: '#111827', fontFamily: 'naskh' },
  { id: 'royal-luxury', name: 'ملكي فاخر', note: 'إطار ملكي ولمسات ذهبية', cardStyle: 'luxury', colorScheme: 'blue-gold', cardEffect: '3d', cardShape: 'square', borderWidth: 3, borderColor: '#d6ad55', accent: '#f7d77a', textColor: '#fffaf0', fontFamily: 'kufi' },
] as const

const sanitizeTextStyles = (value: unknown) => {
  const input = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, any>
    : {};

  const positions = ['top', 'bottom', 'left', 'right', 'center'];
  const aligns = ['right', 'center', 'left'];
  const borders = ['solid', 'dashed', 'dotted'];
  const fonts = ['default', 'arabic', 'mono', 'serif', 'sans', 'kufi', 'naskh', 'system'];

  const safeColor = (v: unknown, fallback: string) =>
    typeof v === 'string' && /^#[0-9a-f]{6}$/i.test(v) ? v : fallback;

  const safeSize = (v: unknown, fallback: number) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(40, Math.max(8, n)) : fallback;
  };

  return Object.fromEntries(
    Object.entries(DEFAULT_TEXT_STYLES).map(([key, defaults]) => {
      const item = input[key] && typeof input[key] === 'object' && !Array.isArray(input[key])
        ? input[key]
        : {};

      return [key, {
        show: typeof item.show === 'boolean' ? item.show : defaults.show,
        fontSize: safeSize(item.fontSize, defaults.fontSize),
        color: safeColor(item.color, defaults.color),
        fontFamily: fonts.includes(item.fontFamily) ? item.fontFamily : defaults.fontFamily,
        position: positions.includes(item.position) ? item.position : defaults.position,
        align: aligns.includes(item.align) ? item.align : defaults.align,
        borderWidth: Number.isFinite(Number(item.borderWidth))
          ? Math.min(6, Math.max(0, Number(item.borderWidth)))
          : defaults.borderWidth,
        borderColor: safeColor(item.borderColor, defaults.borderColor),
        borderStyle: borders.includes(item.borderStyle) ? item.borderStyle : defaults.borderStyle,
        background: item.background === 'transparent'
          ? 'transparent'
          : safeColor(item.background, defaults.background),
      }];
    })
  ) as typeof DEFAULT_TEXT_STYLES;
};

type InputRowProps = { label: string; children: ReactNode; icon?: string; fieldId?: string; activeField: string }

function InputRow({ label, children, icon = '', fieldId = '', activeField }: InputRowProps) {
  return (
    <div
      id={fieldId ? `studio-field-${fieldId}` : undefined}
      className="print-cards-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px',
        padding: '12px 15px',
        background: activeField === fieldId ? 'rgba(0,255,255,0.15)' : 'rgba(0,0,0,0.3)',
        borderRadius: '12px',
        border: activeField === fieldId ? '2px solid #FFD700' : '1px solid rgba(124,58,237,0.30)',
        transition: 'all 0.3s ease',
        boxShadow: activeField === fieldId ? '0 0 20px rgba(124,58,237,0.45)' : 'none'
      }}
    >
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
        {children}
      </div>
      <div style={{ color: activeField === fieldId ? '#FFD700' : '#e2e8f0', fontWeight: 'bold', fontSize: '14px', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '6px', minWidth: '120px', justifyContent: 'flex-end' }}>
        {icon && <span style={{ fontSize: '16px' }}>{icon}</span>}
        {label}
      </div>
    </div>
  )
}
export default function PrintCardsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [printedCards, setPrintedCards] = useState<any[]>([])
  const [batchPrintSnapshot, setBatchPrintSnapshot] = useState<any>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [printRetryAvailable, setPrintRetryAvailable] = useState(false)
  const [batchIdempotencyKey, setBatchIdempotencyKey] = useState<string | null>(null)
  const [batchHistory, setBatchHistory] = useState<any[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState('')
  const [restoringBatchId, setRestoringBatchId] = useState<string | null>(null)
  const [restoredBatchId, setRestoredBatchId] = useState<string | null>(null)
  const [activeField, setActiveField] = useState('')
  const [selectedTextStyleKey, setSelectedTextStyleKey] = useState('network')
  const [activeStudioSection, setActiveStudioSection] = useState('identity')
  const [studioEntry, setStudioEntry] = useState<'choose' | 'workspace'>('choose')
  const [studioTask, setStudioTask] = useState<'design' | 'print'>('design')
  const [activeDesignTemplate, setActiveDesignTemplate] = useState('royal-blue')
  const [cardsCountDraft, setCardsCountDraft] = useState('100')
  const [colsCountDraft, setColsCountDraft] = useState('3')
  const previewRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    profile: 'DEFAULT',
    customMessage: '',
    textStyles: DEFAULT_TEXT_STYLES,
    validity: '1',
    validityType: 'no-expiry',
    userDuration: '1',
    userDurationType: 'no-expiry',
    dataPackage: 'unlimited',
    dataAmount: '1',
    dataUnit: 'GB',
    networkName: 'Jassas Net',
    cardTime: '1',
    cardTimeType: 'hour',
    cardPrice: '500',
    distributor: '',
    usernameColor: '#FFD700',
    usernameLength: 8,
    usernamePrefix: '86',
    cardsCount: 100,
    colsCount: 3,
    cardStyle: 'colored',
    cardBackgroundImage: '',
    cardEffect: 'gradient',
    colorScheme: 'blue-gold',
    cardShape: 'rectangle',
    enableQR: true,
    qrSize: 55,
    rechargeText: '',
    specialOffer: '',
    networkFontSize: 20,
    cardNumberFontSize: 22,
    infoFontSize: 12,
    labelFontSize: 10,
    networkColor: '#ffffff',
    cardNumberColor: '#FFD700',
    infoColor: '#ffffff',
    labelColor: '#e0e0e0',
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#FFD700',
    fontFamily: 'default'
  })

  const selectedTextStyle =
    (formData.textStyles as any)?.[selectedTextStyleKey] ||
    (DEFAULT_TEXT_STYLES as any)[selectedTextStyleKey]

  const studioSectionSteps = [
    { id: 'identity', label: 'الهوية', icon: '🌐', target: 'studio-field-profile' },
    { id: 'numbers', label: 'الأرقام', icon: '🔢', target: 'studio-field-prefix' },
    { id: 'duration', label: 'الصلاحية', icon: '⏱️', target: 'studio-field-validity' },
    { id: 'time', label: 'الوقت والسعر', icon: '💳', target: 'studio-field-cardTime' },
    { id: 'content', label: 'النصوص', icon: '✍️', target: 'studio-field-customMessage' },
    { id: 'design', label: 'التصميم', icon: '🎨', target: 'studio-section-design' },
    { id: 'typography', label: 'الخطوط', icon: '🔤', target: 'studio-section-typography' },
    { id: 'print', label: 'الطباعة', icon: '🖨️', target: 'studio-field-count' },
    { id: 'history', label: 'السجل', icon: '🗂️', target: 'batch-history-heading' },
  ] as const

  const goToStudioStep = (stepId: string) => {
    const step = studioSectionSteps.find((item) => item.id === stepId)
    if (!step) return
    setActiveStudioSection(step.id)
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(step.target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    })
  }



  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      const supabase = createClient()

      const { data, error } = await supabase.auth.getUser()

      if (!mounted) return

      if (error || !data.user) {
        window.location.href = '/login'
        return
      }

      const metadata = data.user.user_metadata || {}

      setUser({
        id: data.user.id,
        fullName:
          metadata.full_name ||
          data.user.email?.split('@')[0] ||
          'المستخدم',
        email: data.user.email || '',
      })
    }

    loadUser()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const sections = [
      ['identity', 'studio-field-profile'],
      ['numbers', 'studio-field-prefix'],
      ['duration', 'studio-field-validity'],
      ['time', 'studio-field-cardTime'],
      ['content', 'studio-field-customMessage'],
      ['design', 'studio-section-design'],
      ['typography', 'studio-section-typography'],
      ['print', 'studio-field-count'],
      ['history', 'batch-history-heading'],
    ] as const

    if (typeof IntersectionObserver === 'undefined') return

    const visibleSections = new Map<string, number>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const sectionId = sections.find(([, targetId]) => targetId === entry.target.id)?.[0]
        if (!sectionId) continue

        if (entry.isIntersecting) {
          visibleSections.set(sectionId, entry.intersectionRatio)
        } else {
          visibleSections.delete(sectionId)
        }
      }

      const activeSection = [...visibleSections.entries()]
        .sort((a, b) => b[1] - a[1])[0]?.[0]

      if (activeSection) setActiveStudioSection(activeSection)
    }, {
      root: null,
      rootMargin: '-18% 0px -62% 0px',
      threshold: [0, 0.1, 0.25, 0.5],
    })

    sections.forEach(([, targetId]) => {
      const target = document.getElementById(targetId)
      if (target) observer.observe(target)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!user) return

    let mounted = true

    const loadHistory = async () => {
      setHistoryLoading(true)
      setHistoryError('')

      try {
        const response = await fetch('/api/print-cards', {
          method: 'GET',
          cache: 'no-store',
        })
        const result = await response.json().catch(() => null)

        if (!response.ok || result?.success !== true) {
          throw new Error(result?.message || 'تعذر تحميل سجل الدفعات.')
        }

        if (mounted) {
          setBatchHistory(Array.isArray(result.batches) ? result.batches : [])
        }
      } catch (error) {
        if (mounted) {
          setHistoryError(
            error instanceof Error ? error.message : 'حدث خطأ أثناء تحميل السجل.'
          )
        }
      } finally {
        if (mounted) setHistoryLoading(false)
      }
    }

    void loadHistory()

    return () => {
      mounted = false
    }
  }, [user])

  const colorSchemes: any = {
    'blue-gold': { bg: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #d4af37 100%)', accent: '#FFD700', text: '#ffffff', border: '#FFD700' },
    'purple-silver': { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #c0c0c0 100%)', accent: '#c0c0c0', text: '#ffffff', border: '#c0c0c0' },
    'green-gold': { bg: 'linear-gradient(135deg, #134e5e 0%, #71b280 50%, #ffd700 100%)', accent: '#ffd700', text: '#ffffff', border: '#ffd700' },
    'red-black': { bg: 'linear-gradient(135deg, #cb2d3e 0%, #ef473a 50%, #1a1a2e 100%)', accent: '#ff0000', text: '#ffffff', border: '#ff0000' },
    'orange-dark': { bg: 'linear-gradient(135deg, #f12711 0%, #f5af19 50%, #2c3e50 100%)', accent: '#f5af19', text: '#ffffff', border: '#f5af19' },
    'blue-green': { bg: 'linear-gradient(135deg, #0066cc 0%, #00cc66 50%, #00ffff 100%)', accent: '#00ffff', text: '#ffffff', border: '#00ffff' },
    'pure-blue': { bg: 'linear-gradient(135deg, #0047AB 0%, #4169E1 50%, #87CEEB 100%)', accent: '#4169E1', text: '#ffffff', border: '#4169E1' },
    'pure-green': { bg: 'linear-gradient(135deg, #228B22 0%, #32CD32 50%, #90EE90 100%)', accent: '#32CD32', text: '#ffffff', border: '#32CD32' },
    'black-gold': { bg: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #FFD700 100%)', accent: '#FFD700', text: '#FFD700', border: '#FFD700' },
    'white-blue': { bg: 'linear-gradient(135deg, #ffffff 0%, #e0eafc 50%, #0066cc 100%)', accent: '#0066cc', text: '#0066cc', border: '#0066cc' },
    'lime-green': { bg: 'linear-gradient(135deg, #263B16 0%, #5F8F24 45%, #B7F34A 100%)', accent: '#B7F34A', text: '#FFFFFF', border: '#D9FF83' },
  }

  const getCardColors = (style: string, scheme: string) => {
  const base =
    style === "plain"
      ? { bg: "#ffffff", accent: "#374151", text: "#111827", border: "#9ca3af" }
      : style === "luxury"
      ? {
          bg: "linear-gradient(135deg, #071b3a 0%, #123f78 48%, #172b4d 75%, #8b6a28 100%)",
          accent: "#f7d77a",
          text: "#fffaf0",
          border: "#d6ad55",
        }
      : style === "three-color"
      ? {
          bg: "linear-gradient(135deg, #ffffff 0%, #eef2ff 58%, #dbeafe 78%, #7c3aed 100%)",
          accent: "#2563eb",
          text: "#172033",
          border: "#7c3aed",
        }
      : (colorSchemes[scheme] || colorSchemes["blue-gold"]);

  const light = style === "plain" || style === "three-color";

  return {
    ...base,
    panel: light ? "#f3f4f6" : "rgba(0,0,0,0.3)",
    panelStrong: light ? "#ffffff" : "rgba(0,0,0,0.3)",
    panelAlt: light ? "#f8fafc" : "rgba(255,255,255,0.1)",
    labelText: light ? "#4b5563" : "#e5e7eb",
    infoText: light ? "#111827" : base.text,
    numberText: light ? "#111827" : base.accent,
    offerBg: style === "plain" ? "#f3f4f6" : light ? "#ede9fe" : "rgba(215,175,80,0.2)",
    offerText: style === "plain" ? "#374151" : light ? "#5b21b6" : "#f7d77a",
    rechargeBg: style === "plain" ? "#e5e7eb" : "linear-gradient(135deg, #2563eb, #7c3aed)",
    rechargeText: style === "plain" ? "#111827" : "#ffffff",
  };
};

const fontFamilies: any = {
    'default': 'Segoe UI, Tahoma, Arial, sans-serif',
    'arabic': 'Arial, Tahoma, sans-serif',
    'kufi': '"Noto Kufi Arabic", Tahoma, Arial, sans-serif',
    'naskh': '"Noto Naskh Arabic", "Times New Roman", serif',
    'system': 'system-ui, "Segoe UI", Tahoma, Arial, sans-serif',
    'mono': '"Courier New", monospace',
    'serif': 'Georgia, "Times New Roman", serif',
    'sans': 'Helvetica, Arial, sans-serif'
  }

  const getCardShapeStyle = (shape: string) => ({
    borderRadius: '0px',
    aspectRatio: shape === 'square' ? '1 / 1' : '1.78 / 1',
  })

  // محرك موحد لتنسيق النصوص في المعاينة وPDF
  const getCardTextStyle = (card: any, key: string) => {
    const defaults = DEFAULT_TEXT_STYLES[key as keyof typeof DEFAULT_TEXT_STYLES];
    const safeDefaults = defaults || DEFAULT_TEXT_STYLES.customMessage;
    const config = card.textStyles?.[key] || safeDefaults;

    return {
      display: config.show === false ? 'none' : 'block',
      fontSize: Math.min(40, Math.max(8, Number(config.fontSize) || safeDefaults.fontSize)),
      color: card.cardStyle === 'plain' ? '#111827' : card.cardStyle === 'three-color' ? '#172033' : (config.color || safeDefaults.color),
      fontFamily: fontFamilies[config.fontFamily] || fontFamilies.default,
      textAlign: config.align || safeDefaults.align,
      border: Math.min(6, Math.max(0, Number(config.borderWidth) || 0)) + 'px ' +
        (config.borderStyle || 'solid') + ' ' + (card.cardStyle === 'plain' ? '#d1d5db' : (config.borderColor || safeDefaults.borderColor)),
      background: card.cardStyle === 'plain'
        ? (config.background !== 'transparent' ? '#f3f4f6' : 'transparent')
        : (config.background || 'transparent'),
      borderRadius: '8px',
      padding: Number(config.borderWidth) > 0 || config.background !== 'transparent'
        ? '5px 7px'
        : '0px',
      boxSizing: 'border-box' as const,
    };
  };

  const getCardBackgroundImage = (card: any) => {
    const layers: string[] = []
    if (card.cardStyle === 'colored' && typeof card.cardBackgroundImage === 'string' &&
      /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(card.cardBackgroundImage) &&
      card.cardBackgroundImage.length <= 200000) {
      layers.push('linear-gradient(rgba(7,17,38,0.38), rgba(7,17,38,0.38))')
      layers.push('url("' + card.cardBackgroundImage + '")')
    }
    return layers.length ? layers.join(', ') : undefined
  }

  const getCardTextCss = (card: any, key: string) => {
    const s = getCardTextStyle(card, key);
    return `display:${s.display};font-size:${s.fontSize}px;color:${s.color};font-family:${s.fontFamily};text-align:${s.textAlign};border:${s.border};background:${s.background};border-radius:${s.borderRadius};padding:${s.padding};box-sizing:border-box;`;
  };

  const restoreBatch = async (batchId: string) => {
    if (restoringBatchId) return

    setRestoringBatchId(batchId)
    try {
      const response = await fetch(
        '/api/print-cards?batch_id=' + encodeURIComponent(batchId),
        { method: 'GET', cache: 'no-store' }
      )
      const result = await response.json().catch(() => null)

      if (!response.ok || result?.success !== true || !result.batch) {
        throw new Error(result?.message || 'تعذر استرجاع الدفعة.')
      }

      const snapshot = result.batch.print_snapshot
      if (
        !snapshot ||
        snapshot.version !== 1 ||
        !snapshot.template ||
        typeof snapshot.template !== 'object' ||
        Array.isArray(snapshot.template) ||
        !snapshot.settings ||
        typeof snapshot.settings !== 'object' ||
        Array.isArray(snapshot.settings) ||
        !Array.isArray(snapshot.usernames) ||
        snapshot.usernames.length !== Number(result.batch.card_count) ||
        snapshot.usernames.length < 1 ||
        snapshot.usernames.length > 10000
      ) {
        throw new Error('بيانات تصميم هذه الدفعة غير مكتملة أو غير مدعومة.')
      }

      const rawSettings = snapshot.settings
      const allowedStyles = ['colored', 'plain', 'three-color', 'luxury']
      const allowedShapes = ['rectangle', 'square']
      const allowedBorders = ['solid', 'dashed', 'dotted']
      const allowedProfiles = ['DEFAULT', 'PREMIUM', 'BASIC']
      const safeHex = (value: unknown, fallback: string) =>
        typeof value === 'string' && /^#[0-9a-f]{6}$/i.test(value)
          ? value
          : fallback
      const clamp = (value: unknown, fallback: number, min: number, max: number) => {
        const parsed = Number(value)
        return Number.isFinite(parsed)
          ? Math.min(max, Math.max(min, parsed))
          : fallback
      }

      const rawBackgroundImage = snapshot.template &&
        typeof snapshot.template === 'object' &&
        typeof (snapshot.template as Record<string, unknown>).cardBackgroundImage === 'string'
          ? (snapshot.template as Record<string, unknown>).cardBackgroundImage as string
          : ''
      const safeBackgroundImage = /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(rawBackgroundImage) &&
        rawBackgroundImage.length <= 200000 ? rawBackgroundImage : ''

      const safeSettings = {
        ...formData,
        ...rawSettings,
        cardBackgroundImage: safeBackgroundImage,
        profile: allowedProfiles.includes(rawSettings.profile) ? rawSettings.profile : 'DEFAULT',
        cardStyle: allowedStyles.includes(rawSettings.cardStyle) ? rawSettings.cardStyle : 'colored',
        colorScheme: Object.prototype.hasOwnProperty.call(colorSchemes, rawSettings.colorScheme)
          ? rawSettings.colorScheme
          : 'blue-gold',
        cardShape: allowedShapes.includes(rawSettings.cardShape) ? rawSettings.cardShape : 'rectangle',
        borderStyle: allowedBorders.includes(rawSettings.borderStyle) ? rawSettings.borderStyle : 'solid',
        fontFamily: Object.prototype.hasOwnProperty.call(fontFamilies, rawSettings.fontFamily)
          ? rawSettings.fontFamily
          : 'default',
        networkName: String(rawSettings.networkName ?? 'Jassas Net').slice(0, 100),
        colsCount: clamp(rawSettings.colsCount, 3, 1, 6),
        qrSize: clamp(rawSettings.qrSize, 55, 40, 80),
        borderWidth: clamp(rawSettings.borderWidth, 2, 1, 8),
        networkFontSize: clamp(rawSettings.networkFontSize, 20, 8, 40),
        cardNumberFontSize: clamp(rawSettings.cardNumberFontSize, 22, 8, 40),
        infoFontSize: clamp(rawSettings.infoFontSize, 12, 8, 30),
        labelFontSize: clamp(rawSettings.labelFontSize, 10, 8, 24),
        usernameColor: safeHex(rawSettings.usernameColor, '#FFD700'),
        networkColor: safeHex(rawSettings.networkColor, '#ffffff'),
        cardNumberColor: safeHex(rawSettings.cardNumberColor, '#FFD700'),
        infoColor: safeHex(rawSettings.infoColor, '#ffffff'),
        labelColor: safeHex(rawSettings.labelColor, '#e0e0e0'),
        borderColor: safeHex(rawSettings.borderColor, '#FFD700'),
        customMessage: String(rawSettings.customMessage ?? '').slice(0, 240),
        textStyles: sanitizeTextStyles(rawSettings.textStyles),
      }

      const template = snapshot.template
      const fallbackColors = getCardColors(safeSettings.cardStyle, safeSettings.colorScheme)

      // Preserve the exact palette saved with the original print batch.
      // Only allow safe CSS color values; fall back per property if invalid.
      const savedColors =
        template.colors &&
        typeof template.colors === 'object' &&
        !Array.isArray(template.colors)
          ? template.colors
          : {}

      const safeCssColor = (value: unknown, fallback: string) =>
        typeof value === 'string' &&
        /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|linear-gradient\([\d\s.,%#a-z-]+\))$/i.test(value.trim())
          ? value.trim()
          : fallback

      const colors = {
        bg: safeCssColor(savedColors.bg, fallbackColors.bg),
        accent: safeCssColor(savedColors.accent, fallbackColors.accent),
        text: safeCssColor(savedColors.text, fallbackColors.text),
        border: safeCssColor(savedColors.border, fallbackColors.border),
        panel: safeCssColor(savedColors.panel, fallbackColors.panel),
        panelStrong: safeCssColor(savedColors.panelStrong, fallbackColors.panelStrong),
        panelAlt: safeCssColor(savedColors.panelAlt, fallbackColors.panelAlt),
        labelText: safeCssColor(savedColors.labelText, fallbackColors.labelText),
        infoText: safeCssColor(savedColors.infoText, fallbackColors.infoText),
        numberText: safeCssColor(savedColors.numberText, fallbackColors.numberText),
        offerBg: safeCssColor(savedColors.offerBg, fallbackColors.offerBg),
        offerText: safeCssColor(savedColors.offerText, fallbackColors.offerText),
        rechargeBg: safeCssColor(savedColors.rechargeBg, fallbackColors.rechargeBg),
        rechargeText: safeCssColor(savedColors.rechargeText, fallbackColors.rechargeText),
      }
      const restoredCards = snapshot.usernames.map((rawUsername: unknown, index: number) => {
        const username = String(rawUsername)
        if (!/^\d{1,32}$/.test(username)) {
          throw new Error('يوجد رقم كرت غير صالح داخل الدفعة المحفوظة.')
        }

        return {
          ...template,
          textStyles: safeSettings.textStyles,
          cardBackgroundImage: safeSettings.cardBackgroundImage,
          customMessage: String(template.customMessage ?? safeSettings.customMessage ?? '').slice(0, 240),
          id: 'restored-' + index + '-' + username,
          username,
          network: String(template.network ?? safeSettings.networkName).slice(0, 100),
          validity: String(template.validity ?? safeSettings.validity).slice(0, 80),
          cardTime: String(template.cardTime ?? safeSettings.cardTime).slice(0, 80),
          dataPackage: String(template.dataPackage ?? safeSettings.dataPackage).slice(0, 80),
          price: String(template.price ?? safeSettings.cardPrice).slice(0, 40),
          distributor: String(template.distributor ?? '').slice(0, 100),
          rechargeText: String(template.rechargeText ?? '').slice(0, 160),
          specialOffer: String(template.specialOffer ?? '').slice(0, 160),
          colors,
          fontFamily: fontFamilies[safeSettings.fontFamily],
          cardShape: safeSettings.cardShape,
          borderStyle: safeSettings.borderStyle,
          borderWidth: safeSettings.borderWidth,
          borderColor: safeSettings.borderColor,
          qrEnabled: template.qrEnabled === true,
          qrSize: safeSettings.qrSize,
          networkFontSize: safeSettings.networkFontSize,
          cardNumberFontSize: safeSettings.cardNumberFontSize,
          infoFontSize: safeSettings.infoFontSize,
          labelFontSize: safeSettings.labelFontSize,
          usernameColor: safeSettings.usernameColor,
          networkColor: safeSettings.networkColor,
          cardNumberColor: safeSettings.cardNumberColor,
          infoColor: safeSettings.infoColor,
          labelColor: safeSettings.labelColor,
        }
      })

      setFormData(safeSettings)
      setCardsCountDraft(String(safeSettings.cardsCount ?? 100))
      setColsCountDraft(String(safeSettings.colsCount ?? 3))
      setPrintedCards(restoredCards)
      setBatchPrintSnapshot({
        ...snapshot,
        settings: safeSettings,
      })
      setBatchIdempotencyKey(null)
      setPrintRetryAvailable(false)
      setRestoredBatchId(batchId)
      setShowConfirm(false)

      alert('تم استرجاع الدفعة وتصميمها. يمكنك إعادة طباعتها دون خصم الرصيد.')
    } catch (error) {
      alert(error instanceof Error ? error.message : 'تعذر استرجاع الدفعة.')
    } finally {
      setRestoringBatchId(null)
    }
  }

  const timeLabels: any = { hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }
  const validityLabels: any = { 'no-expiry': 'بدون مدة', hour: 'ساعة', day: 'يوم', week: 'أسبوع', month: 'شهر' }

  const generateUsername = (prefix: string, length: number) => {
    const safeLength = Math.max(1, Math.min(20, Math.floor(Number(length) || 8)))
    const cleanPrefix = prefix.replace(/[^0-9]/g, '').slice(0, safeLength)
    const remaining = safeLength - cleanPrefix.length
    const randomValues = new Uint32Array(remaining)
    const cryptoApi = typeof globalThis !== 'undefined' ? globalThis.crypto : undefined

    if (remaining > 0 && cryptoApi?.getRandomValues) {
      cryptoApi.getRandomValues(randomValues)
    } else {
      for (let i = 0; i < remaining; i++) {
        randomValues[i] = Math.floor(Math.random() * 10)
      }
    }

    return cleanPrefix + Array.from(
      randomValues,
      value => String(value % 10)
    ).join('')
  }

  const previewNumber = useMemo(
    () => generateUsername(formData.usernamePrefix, formData.usernameLength),
    [formData.usernamePrefix, formData.usernameLength]
  )

  const QRCode = ({
    cardNumber,
    size = 55,
  }: {
    cardNumber: string
    size: number
  }) => (
    <QRCodeSVG
      value={cardNumber}
      size={size}
      level="M"
      marginSize={1}
      bgColor="#ffffff"
      fgColor="#000000"
    />
  )

  const previewCard = {
    username: previewNumber,
    customMessage: formData.customMessage,
    textStyles: formData.textStyles,
    validity: formData.validity + ' ' + validityLabels[formData.validityType],
    userDuration: formData.userDuration + ' ' + validityLabels[formData.userDurationType],
    dataPackage: formData.dataPackage === 'unlimited' ? 'بدون حد' : formData.dataAmount + ' ' + formData.dataUnit,
    network: formData.networkName,
    cardTime: formData.cardTime + ' ' + timeLabels[formData.cardTimeType],
    price: formData.cardPrice,
    distributor: formData.distributor,
    qrEnabled: formData.enableQR,
    qrSize: formData.qrSize,
    rechargeText: formData.rechargeText,
    specialOffer: formData.specialOffer,
    cardStyle: formData.cardStyle,
    cardBackgroundImage: formData.cardBackgroundImage,
    cardEffect: formData.cardEffect,
    cardShape: formData.cardShape,
    colors: getCardColors(formData.cardStyle, formData.colorScheme),
    usernameColor: formData.usernameColor,
    networkFontSize: formData.networkFontSize,
    cardNumberFontSize: formData.cardNumberFontSize,
    infoFontSize: formData.infoFontSize,
    labelFontSize: formData.labelFontSize,
    networkColor: formData.networkColor,
    cardNumberColor: formData.cardNumberColor,
    infoColor: formData.infoColor,
    labelColor: formData.cardStyle === 'plain' || formData.cardStyle === 'three-color' ? '#4b5563' : formData.labelColor,
    borderWidth: formData.borderWidth,
    borderStyle: formData.borderStyle,
    borderColor: formData.borderColor,
    fontFamily: fontFamilies[formData.fontFamily]
  }

  const getCardStyle = (card: any, isActive: boolean = false) => {
    const c = card.colors
    let bg = c.bg
    const shapeStyle = getCardShapeStyle(card.cardShape)
    let shadow = card.cardStyle === 'plain' ? 'none' : '0 10px 30px rgba(0,0,0,0.3)'
    let border = card.cardStyle === 'plain' ? '1px solid #d1d5db' : card.borderWidth + 'px ' + card.borderStyle + ' ' + c.border
    let extraStyle: any = {}
    if (card.cardStyle !== 'plain' && card.cardEffect === '3d') {
      shadow = '0 20px 50px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.3), inset 0 -2px 10px rgba(0,0,0,0.2)'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    } else if (card.cardStyle !== 'plain' && card.cardEffect === 'shadow') {
      shadow = '0 25px 60px rgba(0,0,0,0.6), 0 15px 40px rgba(0,0,0,0.4)'
    } else if (card.cardStyle !== 'plain' && card.cardEffect === 'glow') {
      shadow = '0 0 30px ' + c.accent + ', 0 0 60px ' + c.accent + '88'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    }
    if (isActive && card.cardStyle !== 'plain') {
      shadow = '0 0 0 4px rgba(124,58,237,0.45), ' + shadow
      extraStyle.transform = 'scale(1.02)'
    }
    return {
      background: bg,
      backgroundImage: getCardBackgroundImage(card),
      backgroundSize: card.cardBackgroundImage ? 'cover' : undefined,
      backgroundPosition: card.cardBackgroundImage ? 'center' : undefined,
      boxShadow: shadow,
      borderRadius: shapeStyle.borderRadius,
      aspectRatio: shapeStyle.aspectRatio,
      border: border,
      color: c.text,
      padding: '15px',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: card.fontFamily,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      ...extraStyle
    }
  }

  const generateCards = () => {
    const cards = []
    const qty = Number(cardsCountDraft)
    const columns = Number(colsCountDraft)

    if (!cardsCountDraft || !Number.isInteger(qty) || qty < 1 || qty > 10000) {
      alert('حدد كمية صحيحة بين 1 و10000 كرت.')
      return
    }
    if (!colsCountDraft || !Number.isInteger(columns) || columns < 1 || columns > 6) {
      alert('حدد عدد أعمدة صحيحاً بين 1 و6.')
      return
    }

    let nextIdempotencyKey: string

    try {
      nextIdempotencyKey = createBatchIdempotencyKey()
    } catch {
      alert('تعذر إنشاء مفتاح آمن للدفعة. حدّث الصفحة وحاول مرة أخرى.')
      return
    }

    const colors = getCardColors(formData.cardStyle, formData.colorScheme)
    const usedNumbers = new Set<string>()

    for (let i = 0; i < qty; i++) {
      let username = ''
      let attempts = 0

      do {
        username = generateUsername(formData.usernamePrefix, formData.usernameLength)
        attempts++
      } while (usedNumbers.has(username) && attempts < 100)

      if (usedNumbers.has(username)) {
        alert('تعذر توليد أرقام فريدة لهذه الدفعة. زِد طول الرقم أو غيّر البادئة.')
        return
      }

      usedNumbers.add(username)
      cards.push({
        id: 'JNC-' + Date.now() + '-' + i,
        username: username,
        validity: formData.validity + ' ' + validityLabels[formData.validityType],
        dataPackage: formData.dataPackage === 'unlimited' ? 'بدون حد' : formData.dataAmount + ' ' + formData.dataUnit,
        network: formData.networkName,
        cardTime: formData.cardTime + ' ' + timeLabels[formData.cardTimeType],
        price: formData.cardPrice,
        distributor: formData.distributor,
        qrEnabled: formData.enableQR,
        qrSize: formData.qrSize,
        rechargeText: formData.rechargeText,
        specialOffer: formData.specialOffer,
        customMessage: formData.customMessage,
        textStyles: formData.textStyles,
        cardBackgroundImage: formData.cardBackgroundImage,
        cardStyle: formData.cardStyle,
        cardEffect: formData.cardEffect,
        cardShape: formData.cardShape,
        colors: colors,
        usernameColor: formData.usernameColor,
        networkFontSize: formData.networkFontSize,
        cardNumberFontSize: formData.cardNumberFontSize,
        infoFontSize: formData.infoFontSize,
        labelFontSize: formData.labelFontSize,
        networkColor: formData.networkColor,
        cardNumberColor: formData.cardNumberColor,
        infoColor: formData.infoColor,
        labelColor: formData.labelColor,
        borderWidth: formData.borderWidth,
        borderStyle: formData.borderStyle,
        borderColor: formData.borderColor,
        fontFamily: fontFamilies[formData.fontFamily]
      })
    }
    setPrintedCards(cards)
    setRestoredBatchId(null)
    setBatchPrintSnapshot({
      version: 1,
      template: cards[0],
      usernames: cards.map((card) => String(card.username)),
      settings: { ...formData, cardBackgroundImage: '', cardsCount: qty, colsCount: columns },
    })
    setBatchIdempotencyKey(nextIdempotencyKey)
    setPrintRetryAvailable(false)
    setShowConfirm(true)
  }

  const confirmAndPrint = async () => {
    if (isSaving || printedCards.length === 0) return

    if (!batchPrintSnapshot) {
      alert('نسخة تصميم الدفعة غير جاهزة. أنشئ الدفعة مرة أخرى.')
      return
    }

    if (!batchIdempotencyKey) {
      alert('مفتاح الدفعة غير متوفر. أنشئ الدفعة مرة أخرى قبل الحفظ.')
      return
    }

    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('اسمح بفتح النوافذ المنبثقة أولاً، ثم أعد المحاولة.')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/print-cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idempotency_key: batchIdempotencyKey,
          print_snapshot: batchPrintSnapshot,
          cards: printedCards.map((card) => ({
            card_code: String(card.username),
            card_value: `${String(card.price ?? '').trim()} جنيه | ${String(card.dataPackage ?? '').trim()} | ${String(card.network ?? '').trim()}`,
            duration: `${String(card.validity ?? '').trim()} | ${String(card.cardTime ?? '').trim()}`,
          })),
        }),
      })

      const result = await response.json().catch(() => null)
      if (!response.ok || result?.success !== true) {
        printWindow.close()
        alert(result?.message || 'تعذر حفظ الكروت. لم تبدأ الطباعة.')
        return
      }

      setShowConfirm(false)
      const printPrepared = await exportSamplePDF(printedCards, true, printWindow, batchPrintSnapshot.settings)
      if (printPrepared) {
        setPrintRetryAvailable(false)
        alert(`تم حفظ ${result.saved_count} كرت وتجهيز صفحة الطباعة. الرصيد المتبقي: ${result.cards_remaining ?? 'غير متاح'}.`)
      } else {
        setPrintRetryAvailable(true)
        alert('تم حفظ الدفعة بالفعل، لكن تعذّر تجهيز الطباعة. استخدم زر إعادة طباعة الدفعة المحفوظة؛ لا تنشئ دفعة جديدة.')
      }
    } catch (error) {
      printWindow.close()
      console.error('Card save request failed:', error)
      alert('انقطع الاتصال قبل تأكيد النتيجة. الدفعة ومفتاحها محفوظان في الصفحة؛ اضغط تأكيد الطباعة مرة أخرى، وسيمنع النظام خصم الرصيد مرتين.')
    } finally {
      setIsSaving(false)
    }
  }

  const exportSamplePDF = async (
    cardsToPrint: any[] = [previewCard],
    batch = false,
    preopenedWindow?: Window | null,
    printSettings: any = formData
  ): Promise<boolean> => {
    if (!Array.isArray(cardsToPrint) || cardsToPrint.length === 0) {
      alert('لا توجد كروت جاهزة للطباعة.')
      return false
    }

    const printWindow = preopenedWindow === undefined
      ? window.open('', '_blank')
      : preopenedWindow
    if (!printWindow) {
      alert('الرجاء السماح بفتح النوافذ المنبثقة')
      return false
    }

    const cardsHTML: string[] = []

    for (const card of cardsToPrint) {
    let qrDataUrl = ''
    try {
      if (card.qrEnabled) {
        qrDataUrl = await QRCodeGenerator.toDataURL(
          card.username,
          {
            width: Math.max(64, Number(card.qrSize) || 55),
            margin: 1,
            errorCorrectionLevel: 'M'
          }
        )
      }
    } catch (error) {
      printWindow.close()
      console.error('QR generation failed:', error)
      alert('تعذر إنشاء رمز QR. حاول مرة أخرى.')
      return false
    }

    const c = card.colors
    let bg = c.bg
    const shapeStyle = getCardShapeStyle(card.cardShape)

    let shadow = card.cardStyle === 'plain' ? 'none' : '0 10px 30px rgba(0,0,0,0.3)'
    let border = card.cardStyle === 'plain' ? '1px solid #d1d5db' : card.borderWidth + 'px ' + card.borderStyle + ' ' + c.border

    if (card.cardStyle !== 'plain' && card.cardEffect === '3d') {
      shadow = '0 20px 50px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.3), inset 0 -2px 10px rgba(0,0,0,0.2)'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    } else if (card.cardStyle !== 'plain' && card.cardEffect === 'shadow') {
      shadow = '0 25px 60px rgba(0,0,0,0.6), 0 15px 40px rgba(0,0,0,0.4)'
    } else if (card.cardStyle !== 'plain' && card.cardEffect === 'glow') {
      shadow = '0 0 30px ' + c.accent + ', 0 0 60px ' + c.accent + '88'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    }

    const allowedFontFamilies = Object.values(fontFamilies)
    const fontFamily = allowedFontFamilies.includes(card.fontFamily)
      ? card.fontFamily
      : fontFamilies.default

    const cardHTML = `
      <div style="position: relative; overflow: hidden; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr); grid-template-areas: 'header header' 'username info' 'footer footer'; align-items: start; gap: 8px; background: ${bg}; ${getCardBackgroundImage(card) ? 'background-image: ' + getCardBackgroundImage(card) + '; background-size:cover; background-position:center;' : ''} border-radius: ${shapeStyle.borderRadius}; aspect-ratio: ${shapeStyle.aspectRatio}; border: ${border}; padding: 12px; width: 100%; box-sizing: border-box; color: ${c.text}; margin: 0; break-inside: avoid; page-break-inside: avoid; box-shadow: ${shadow}; font-family: ${fontFamily};">
            ${card.cardStyle !== 'plain' ? `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-25deg); width:95%; text-align:center; font-size:16px; line-height:1.8; font-weight:900; color:${c.accent}; opacity:0.12; pointer-events:none; z-index:0;">جساس نت كرت<br>JASSAS NET CARD</div>` : ''}
        <div style="grid-area:header; display:flex; justify-content:space-between; align-items:center; position:relative; z-index:1; min-width:0; margin-bottom:0;">
          <div style="flex:1; background:${c.panelAlt}; border-radius:12px; padding:10px 15px; text-align:center; border:${card.cardStyle === 'plain' ? '0' : card.borderWidth + 'px ' + card.borderStyle + ' ' + card.borderColor}; margin-right:${card.qrEnabled || card.rechargeText ? '10px' : '0'}; box-shadow:${card.cardStyle === 'plain' ? 'none' : 'inset 0 2px 10px rgba(0,0,0,0.2)'};">
            <div style="font-size:${card.labelFontSize}px; color:${card.labelColor}; opacity:0.9; margin-bottom:4px;">${card.cardStyle === 'plain' ? 'الشبكة' : '🌐 الشبكة'}</div>
            ${card.textStyles?.network?.show !== false ? `<div style="${getCardTextCss(card, 'network')}font-weight:bold;line-height:1.2;text-shadow:0 3px 10px rgba(0,0,0,0.4);">${escapeHtml(card.network)}</div>` : ''}
          </div>
          ${(card.qrEnabled || card.rechargeText) ? `<div style="display:flex; flex-direction:column; gap:6px; flex-shrink:0;">
            ${card.qrEnabled ? `<div style="background:#fff; border-radius:10px; padding:4px; box-shadow:0 4px 15px rgba(0,0,0,0.3); border:2px solid ${c.accent};">
              <img src="${qrDataUrl}" width="${card.qrSize}" height="${card.qrSize}" alt="QR Code" style="display:block; width:${card.qrSize}px; height:${card.qrSize}px;" />
            </div>` : ''}
            ${card.rechargeText && card.textStyles?.recharge?.show !== false ? `<div style="background:${c.rechargeBg}; border-radius:10px; padding:6px 10px; box-shadow:0 4px 15px rgba(37,99,235,0.35); border:1px solid ${c.accent};">
              <div style="${getCardTextCss(card, 'recharge')}font-weight:bold;white-space:nowrap;text-shadow:0 2px 5px rgba(0,0,0,0.3);">⚡ ${escapeHtml(card.rechargeText)}</div>
            </div>` : ''}
          </div>` : ''}
        </div>
        <div style="grid-area:username; min-width:0; align-self:stretch; background: ${c.panel}; border-radius: 12px; padding: 10px 8px; margin:0; border: ${card.cardStyle === 'plain' ? '1px solid #d1d5db' : '2px dashed ' + c.accent}; text-align: center;">
          <div style="font-size: ${card.labelFontSize}px; color: ${card.labelColor}; margin-bottom: 5px;">${card.cardStyle === 'plain' ? 'رقم الكرت / بيانات الدخول' : '🔢 رقم الكرت / بيانات الدخول'}</div>
          ${card.textStyles?.username?.show !== false ? `<div style="${getCardTextCss(card, 'username')}font-weight:bold;letter-spacing:3px;text-shadow:0 3px 10px rgba(0,0,0,0.5);">${escapeHtml(card.username)}</div>` : ''}
        </div>
        <div style="grid-area:info; min-width:0; display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: ${card.infoFontSize}px;">
          <div style="background: ${c.panel}; padding: 8px; border-radius: 10px; text-align: center; border: 1px solid ${c.accent};">
            <div style="font-size: ${card.labelFontSize}px; color: ${card.labelColor}; margin-bottom: 3px;">⏱️ الصلاحية</div>
            ${card.textStyles?.validity?.show !== false ? `<div style="${getCardTextCss(card, 'validity')}font-weight:bold;">${escapeHtml(card.validity)}</div>` : ''}
          </div>
          <div style="background: ${c.panel}; padding: 8px; border-radius: 10px; text-align: center; border: 1px solid ${c.accent};">
            <div style="font-size: ${card.labelFontSize}px; color: ${card.labelColor}; margin-bottom: 3px;">⏰ الوقت</div>
            ${card.textStyles?.time?.show !== false ? `<div style="${getCardTextCss(card, 'time')}font-weight:bold;">${escapeHtml(card.cardTime)}</div>` : ''}
          </div>
          <div style="background: ${c.panel}; padding: 8px; border-radius: 10px; text-align: center; border: 1px solid ${c.accent};">
            <div style="font-size: ${card.labelFontSize}px; color: ${card.labelColor}; margin-bottom: 3px;">💾 البيانات</div>
            ${card.textStyles?.data?.show !== false ? `<div style="${getCardTextCss(card, 'data')}font-weight:bold;">${escapeHtml(card.dataPackage)}</div>` : ''}
          </div>
          <div style="background: ${c.panel}; padding: 8px; border-radius: 10px; text-align: center; border: 1px solid ${c.accent};">
            <div style="font-size: ${card.labelFontSize}px; color: ${card.labelColor}; margin-bottom: 3px;">💰 السعر</div>
            ${card.textStyles?.price?.show !== false ? `<div style="${getCardTextCss(card, 'price')}font-weight:bold;">${escapeHtml(card.price)}</div>` : ''}
          </div>
        </div>
        ${card.distributor && card.textStyles?.distributor?.show !== false ? `<div style="grid-column:1 / -1; margin-top:0;${getCardTextCss(card, 'distributor')}">الموزع: ${escapeHtml(card.distributor)}</div>` : ''}
        ${card.specialOffer && card.textStyles?.offer?.show !== false ? `<div style="grid-column:1 / -1; margin-top:0;position:relative;z-index:1;${getCardTextCss(card, 'offer')}">🎁 ${escapeHtml(card.specialOffer)}</div>` : ''}
        ${card.customMessage && card.textStyles?.customMessage?.show !== false ? `<div style="grid-column:1 / -1; margin-top:0;position:relative;z-index:1;${getCardTextCss(card, 'customMessage')}">${escapeHtml(card.customMessage)}</div>` : ''}
        ${card.textStyles?.warning?.show !== false ? `<div style="grid-column:1 / -1; position:relative;z-index:1;margin-top:0;${getCardTextCss(card, 'warning')}line-height:1.6;font-weight:600;">احتفظ بهذا الكرت بعد التسجيل لاستكمال المدة والاستفادة من الباقة كاملة</div>` : ''}
            <div style="grid-column:1 / -1; position:relative; z-index:1; text-align:center; margin-top:0; padding-top:6px; border-top:1px solid ${c.accent}; font-size:10px; opacity:0.8; color:${c.text};">جساس نت كرت – JASSAS NET CARD</div>
      </div>
    `
    cardsHTML.push(cardHTML)
    }
    printWindow.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>عينة كرت - ${escapeHtml(printSettings.networkName)}</title><style>@page { size: A4; margin: 20mm; } body { font-family: Arial, Tahoma, sans-serif; background: #f5f5f5; padding: 20px; } .no-print { background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 12px; } .no-print button { padding: 12px 25px; margin: 5px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; } @media print { body { padding: 0; background: #fff; } .no-print { display: none !important; } }</style></head><body><div class="no-print"><h2>🖨️ عينة الكرت - طباعة PDF</h2><p>اضغط Ctrl+P ثم اختر "حفظ كـ PDF"</p><button onclick="window.print()" style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: #0f172a;">️ طباعة / حفظ PDF</button><button onclick="window.close()" style="background: #ef4444; color: #fff;">إغلاق</button></div><div class="cards-grid" style="display:grid;grid-template-columns:repeat(${batch ? Math.max(1, Math.min(6, Number(printSettings.colsCount) || 3)) : 1},minmax(0,1fr));gap:12px;align-items:start;">${cardsHTML.join('')}</div></body></html>`)
    printWindow.document.close()
    return true
  }

  if (!user) {
    return <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><p>جاري التحميل...</p></div>
  }



  return (
    <div className="print-cards-shell" style={{ minHeight: '100vh', padding: '15px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '1120px', width: '100%', margin: '0 auto' }}>
        
        <header className="print-cards-header">
          <div className="print-cards-brand">
            <BrandLogo compact />
            <div className="print-cards-brand-copy">
              <h1>إدارة وطباعة كروت الإنترنت</h1>
              <p>Jassas Net Card · JASSAS SOFT PRO</p>
            </div>
          </div>
          <div className="print-cards-header-actions">
            <button type="button" className="print-cards-back studio-back-icon" aria-label="الرجوع للصفحة السابقة" title="الرجوع للصفحة السابقة" onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) router.back()
              else router.push('/dashboard')
            }}>
              <span aria-hidden="true">›</span>
            </button>
            <AuthThemeToggle />
          </div>
        </header>

        {studioEntry === 'choose' ? (
          <section className="studio-entry-screen" aria-labelledby="studio-entry-title">
            <div className="studio-entry-heading">
              <span className="studio-entry-kicker">JASSAS CARD STUDIO PRO</span>
              <h2 id="studio-entry-title">ابدأ تصميم كروتك</h2>
              <p>اختر نوع الكروت، ثم انتقل إلى التصميم أو تجهيز الطباعة.</p>
            </div>
            <div className="studio-entry-grid">
              <button type="button" className="studio-entry-card studio-entry-plain" onClick={() => { setFormData(current => ({ ...current, cardStyle: 'plain' })); setStudioTask('design'); setStudioEntry('workspace') }}>
                <span className="studio-entry-art"><span>▤</span><i>JASSAS NET</i><small>HOTSPOT VOUCHER</small></span>
                <strong>الكروت العادية</strong>
                <small>تصميم عملي واقتصادي، واضح وسهل القراءة</small>
                <span className="studio-entry-features">قوالب بسيطة · خطوط واضحة · طباعة اقتصادية</span>
                <b>اختيار الكروت العادية ←</b>
              </button>
              <button type="button" className="studio-entry-card studio-entry-color" onClick={() => { setFormData(current => ({ ...current, cardStyle: 'colored' })); setStudioTask('design'); setStudioEntry('workspace') }}>
                <span className="studio-entry-art"><span>✦</span><i>JASSAS NET</i><small>PREMIUM HOTSPOT</small></span>
                <strong>الكروت الملونة</strong>
                <small>ألوان متناسقة وإطارات وتأثيرات فاخرة</small>
                <span className="studio-entry-features">تدرجات · زخارف · قوالب ملونة</span>
                <b>اختيار الكروت الملونة ←</b>
              </button>
            </div>
          </section>
        ) : (
          <>
            <div className="studio-workspace-topline">
              <button type="button" onClick={() => setStudioEntry('choose')}>← تغيير نوع الكرت</button>
              <span>{formData.cardStyle === 'plain' ? 'الكروت العادية' : 'الكروت الملونة'}</span>
            </div>
                    {studioTask === 'design' && <>
        {/* المعاينة الديناميكية - تظهر في وضع التصميم فقط */}
        <div ref={previewRef} className="print-cards-preview studio-preview-dock" style={{
          position: 'sticky', top: '4px', zIndex: 100, marginBottom: '12px',
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(18px)',
          borderRadius: '16px', padding: '10px',
          border: '1px solid rgba(124,58,237,0.38)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.28)'
        }}>
          <div className="studio-preview-toolbar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '6px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { void exportSamplePDF() }} style={{ padding: '8px 15px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37,99,235,0.30)' }}>
                📄 عينة PDF
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="print-cards-preview-card studio-preview-card" data-card-shape={previewCard.cardShape} style={{ ...getCardStyle(previewCard, activeField !== ''), maxWidth: previewCard.cardShape === 'square' ? '280px' : '440px', width: '100%', aspectRatio: previewCard.cardShape === 'square' ? '1 / 1' : '1.78 / 1', height: 'auto', maxHeight: 'none', minHeight: 0, boxSizing: 'border-box', position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)', gridTemplateAreas: '"header header" "username info" "footer footer"', alignItems: 'start', gap: '6px', padding: '10px' }}>
              {previewCard.cardStyle !== 'plain' && <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-25deg)', width: '95%', textAlign: 'center', fontSize: '16px', opacity: 0.12, fontWeight: 900, whiteSpace: 'normal', lineHeight: 1.8, pointerEvents: 'none', zIndex: 0, color: previewCard.colors.accent }}>جساس نت كرت<br />JASSAS NET CARD</div>}
              <div style={{ gridArea: 'header', minWidth: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: 0 }}>
                <div style={{ flex: 1, background: previewCard.colors.panelAlt, backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '10px 15px', textAlign: 'center', border: previewCard.cardStyle === 'plain' ? '0' : previewCard.borderWidth + 'px ' + previewCard.borderStyle + ' ' + previewCard.borderColor, marginRight: (previewCard.qrEnabled || previewCard.rechargeText) ? '10px' : '0', boxShadow: previewCard.cardStyle === 'plain' ? 'none' : 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, marginBottom: '4px' }}>{previewCard.cardStyle === 'plain' ? 'الشبكة' : '🌐 الشبكة'}</div>
                  {previewCard.textStyles?.network?.show !== false && <h3 style={{ margin: 0, fontWeight: 'bold', lineHeight: 1.2, textShadow: '0 3px 10px rgba(0,0,0,0.4)', ...getCardTextStyle(previewCard, 'network') }}>{previewCard.network}</h3>}
                </div>
                {(previewCard.qrEnabled || previewCard.rechargeText) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    {previewCard.qrEnabled && (
                      <div style={{ background: '#fff', borderRadius: '10px', padding: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '2px solid ' + previewCard.colors.accent }}>
                        <QRCode cardNumber={previewCard.username} size={previewCard.qrSize} />
                      </div>
                    )}
                    {previewCard.rechargeText && previewCard.textStyles?.recharge?.show !== false && (
                      <div style={{ background: previewCard.colors.rechargeBg, borderRadius: '10px', padding: '6px 10px', boxShadow: '0 4px 15px rgba(37,99,235,0.35)', border: '1px solid ' + previewCard.colors.accent }}>
                        <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', textShadow: '0 2px 5px rgba(0,0,0,0.3)', ...getCardTextStyle(previewCard, 'recharge') }}>⚡ {previewCard.rechargeText}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ gridArea: 'username', minWidth: 0, alignSelf: 'stretch', background: previewCard.colors.panel, backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '10px 8px', position: 'relative', zIndex: 1, border: previewCard.cardStyle === 'plain' ? '1px solid #d1d5db' : '2px dashed ' + previewCard.colors.accent, marginBottom: 0, boxShadow: previewCard.cardStyle === 'plain' ? 'none' : 'inset 0 3px 10px rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '5px' }}>{previewCard.cardStyle === 'plain' ? 'رقم الكرت / اسم المستخدم' : '🔢 رقم الكرت / اسم المستخدم'}</div>
                {previewCard.textStyles?.username?.show !== false && <div style={{ ...getCardTextStyle(previewCard, 'username'), fontWeight: 'bold', letterSpacing: '3px', textShadow: '0 3px 10px rgba(0,0,0,0.5)' }}>{previewCard.username}</div>}
              </div>
              <div style={{ gridArea: 'info', minWidth: 0, fontSize: previewCard.infoFontSize + 'px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div style={{ background: previewCard.colors.panel, padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: previewCard.cardStyle === 'plain' ? 'none' : 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>⏱️ الصلاحية</div>
                  {previewCard.textStyles?.validity?.show !== false && <div style={{ fontWeight: 'bold', ...getCardTextStyle(previewCard, 'validity') }}>{previewCard.validity}</div>}
                </div>
                <div style={{ background: previewCard.colors.panel, padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: previewCard.cardStyle === 'plain' ? 'none' : 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>⏰ الوقت</div>
                  {previewCard.textStyles?.time?.show !== false && <div style={{ fontWeight: 'bold', ...getCardTextStyle(previewCard, 'time') }}>{previewCard.cardTime}</div>}
                </div>
                <div style={{ background: previewCard.colors.panel, padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: previewCard.cardStyle === 'plain' ? 'none' : 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>💾 البيانات</div>
                  {previewCard.textStyles?.data?.show !== false && <div style={{ fontWeight: 'bold', ...getCardTextStyle(previewCard, 'data') }}>{previewCard.dataPackage}</div>}
                </div>
                <div style={{ background: previewCard.colors.panel, padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: previewCard.cardStyle === 'plain' ? 'none' : 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>💰 السعر</div>
                  {previewCard.textStyles?.price?.show !== false && <div style={{ fontWeight: 'bold', ...getCardTextStyle(previewCard, 'price') }}>{previewCard.price}</div>}
                </div>
              </div>
              {previewCard.distributor && previewCard.textStyles?.distributor?.show !== false && <div style={{ gridColumn: '1 / -1', marginTop: 0, position: 'relative', zIndex: 1, ...getCardTextStyle(previewCard, 'distributor') }}>الموزع: {previewCard.distributor}</div>}
              {previewCard.specialOffer && previewCard.textStyles?.offer?.show !== false && <div style={Object.assign(
                  {
                    gridColumn: '1 / -1',
                    marginTop: 0,
                    padding: '6px',
                    background: previewCard.colors.offerBg,
                    borderRadius: '8px',
                    textAlign: 'center' as const,
                    position: 'relative' as const,
                    zIndex: 1,
                    border: '1px solid ' + previewCard.colors.accent,
                  },
                  getCardTextStyle(previewCard, 'offer'),
                  {
                    background: previewCard.textStyles?.offer?.background && previewCard.textStyles.offer.background !== 'transparent'
                      ? previewCard.textStyles.offer.background
                      : previewCard.colors.offerBg,
                    border: Number(previewCard.textStyles?.offer?.borderWidth) > 0
                      ? getCardTextStyle(previewCard, 'offer').border
                      : '1px solid ' + previewCard.colors.accent,
                  }
                )}>🎁 {previewCard.specialOffer}</div>}
              {previewCard.customMessage && previewCard.textStyles?.customMessage?.show !== false && (
                <div style={{ gridColumn: '1 / -1', ...getCardTextStyle(previewCard, 'customMessage'), marginTop: 0, position: 'relative', zIndex: 1 }}>
                  {previewCard.customMessage}
                </div>
              )}
                            {previewCard.textStyles?.warning?.show !== false && <div style={{ gridColumn: '1 / -1', marginTop: 0, position: 'relative', zIndex: 1, lineHeight: 1.6, fontWeight: 600, ...getCardTextStyle(previewCard, 'warning') }}>احتفظ بهذا الكرت بعد التسجيل لاستكمال المدة والاستفادة من الباقة كاملة</div>}
            </div>
          </div>
          <div className="studio-preview-caption" dir="rtl">
            <span>👁️ معاينة الكرت</span>
            <small>تتحدث مباشرة مع كل تعديل</small>
          </div>
        </div>


        </>}

        <nav className="studio-workspace-tabs" aria-label="مساحة العمل">
          <button type="button" className={studioTask === 'design' ? 'is-active' : ''} onClick={() => { setStudioTask('design'); goToStudioStep('identity') }}><span>🎨</span><strong>التصميم</strong><small>القوالب والألوان والخطوط</small></button>
          <button type="button" className={studioTask === 'print' ? 'is-active' : ''} onClick={() => { setStudioTask('print'); goToStudioStep('print') }}><span>🖨️</span><strong>الطباعة</strong><small>المقاسات والتوزيع وملف PDF</small></button>
        </nav>

        <div className="studio-stepper-wrap" hidden={studioTask === 'print'}>
          <nav className="studio-section-nav" aria-label="خطوات إعداد تصميم الكرت">
          {studioSectionSteps.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`studio-section-tab${activeStudioSection === section.id ? ' is-active' : ''}`}
              aria-current={activeStudioSection === section.id ? 'location' : undefined}
              onClick={() => goToStudioStep(section.id)}
            >
              <span aria-hidden="true">{section.icon}</span>
              <span>{section.label}</span>
            </button>
          ))}
          </nav>
          <div className="studio-step-controls">
            <button type="button" onClick={() => {
              const index = studioSectionSteps.findIndex((item) => item.id === activeStudioSection)
              goToStudioStep(studioSectionSteps[Math.max(0, index - 1)].id)
            }} disabled={activeStudioSection === studioSectionSteps[0].id}>السابق</button>
            <span>{Math.max(1, studioSectionSteps.findIndex((item) => item.id === activeStudioSection) + 1)} / {studioSectionSteps.length}</span>
            <button type="button" onClick={() => {
              const index = studioSectionSteps.findIndex((item) => item.id === activeStudioSection)
              goToStudioStep(studioSectionSteps[Math.min(studioSectionSteps.length - 1, index + 1)].id)
            }} disabled={activeStudioSection === studioSectionSteps[studioSectionSteps.length - 1].id}>التالي ←</button>
          </div>
        </div>

        <section aria-labelledby="batch-history-heading" data-active-step={activeStudioSection} style={{ marginBottom: '20px', padding: '20px', borderRadius: '18px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(214,173,85,0.45)', boxShadow: '0 8px 28px rgba(0,0,0,0.18)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <div>
              <h2 id="batch-history-heading" style={{ color: '#f3d58a', margin: 0, fontSize: '19px' }}>🗂️ سجل دفعات الطباعة</h2>
              <p style={{ color: '#cbd5e1', margin: '6px 0 0', fontSize: '13px' }}>استرجع أي دفعة سابقة واطبعها بنفس تصميمها دون خصم جديد.</p>
            </div>
            <button type="button" onClick={() => {
              setHistoryLoading(true)
              setHistoryError('')
              void fetch('/api/print-cards', { cache: 'no-store' })
                .then(async (response) => {
                  const result = await response.json().catch(() => null)
                  if (!response.ok || result?.success !== true) throw new Error(result?.message || 'تعذر تحديث السجل.')
                  setBatchHistory(Array.isArray(result.batches) ? result.batches : [])
                })
                .catch((error) => setHistoryError(error instanceof Error ? error.message : 'تعذر تحديث السجل.'))
                .finally(() => setHistoryLoading(false))
            }} disabled={historyLoading} style={{ minHeight: '42px', padding: '9px 14px', borderRadius: '10px', border: '1px solid rgba(214,173,85,0.5)', background: 'rgba(30,64,175,0.35)', color: '#fff', fontWeight: 700, cursor: historyLoading ? 'wait' : 'pointer' }}>
              {historyLoading ? 'جارٍ التحديث...' : '↻ تحديث السجل'}
            </button>
          </div>

          {historyError && <p role="alert" style={{ color: '#fca5a5', fontSize: '13px' }}>{historyError}</p>}
          {historyLoading && batchHistory.length === 0 && <p role="status" style={{ color: '#cbd5e1' }}>جارٍ تحميل الدفعات...</p>}
          {!historyLoading && !historyError && batchHistory.length === 0 && <p style={{ color: '#cbd5e1', fontSize: '14px' }}>لا توجد دفعات محفوظة حتى الآن.</p>}

          {batchHistory.length > 0 && (
            <div style={{ display: 'grid', gap: '10px' }}>
              {batchHistory.map((batch) => (
                <div key={batch.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', padding: '13px', borderRadius: '12px', background: 'rgba(15,23,42,0.55)', border: '1px solid rgba(148,163,184,0.2)' }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ color: '#f8fafc', fontWeight: 800, fontSize: '14px' }}>{Number(batch.card_count) || 0} كرت</div>
                    <div style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '5px' }}>
                      {batch.created_at ? new Date(batch.created_at).toLocaleString('ar') : 'تاريخ غير متاح'}
                    </div>
                    <div style={{ color: '#f3d58a', fontSize: '12px', marginTop: '4px' }}>
                      الرصيد بعد الحفظ: {batch.cards_remaining ?? 'غير متاح'}
                    </div>
                  </div>
                  <button type="button" onClick={() => void restoreBatch(String(batch.id))} disabled={restoringBatchId !== null} style={{ minHeight: '44px', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(96,165,250,0.65)', background: 'linear-gradient(135deg,#1d4ed8,#4338ca)', color: '#fff', fontWeight: 800, cursor: restoringBatchId !== null ? 'wait' : 'pointer', opacity: restoringBatchId !== null && restoringBatchId !== batch.id ? 0.55 : 1 }}>
                    {restoringBatchId === batch.id ? 'جارٍ الاسترجاع...' : 'استرجاع وإعادة طباعة'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {restoredBatchId && printedCards.length > 0 && (
          <div role="status" style={{ marginBottom: '18px', padding: '18px', borderRadius: '16px', background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(96,165,250,0.55)', color: '#e2e8f0' }}>
            <div style={{ fontWeight: 800, marginBottom: '8px', color: '#bfdbfe' }}>تم استرجاع الدفعة المحفوظة</div>
            <p style={{ fontSize: '14px', lineHeight: 1.8, marginBottom: '12px' }}>هذه إعادة طباعة فقط. لن يتم إرسال طلب حفظ ولن يُخصم أي رصيد.</p>
            <button type="button" onClick={async () => {
              const prepared = await exportSamplePDF(printedCards, true, undefined, batchPrintSnapshot?.settings || formData)
              if (prepared) alert('تم تجهيز صفحة الطباعة للدفعة المسترجعة.')
            }} style={{ width: '100%', minHeight: '48px', padding: '13px 16px', border: '1px solid rgba(147,197,253,0.7)', borderRadius: '12px', background: 'linear-gradient(135deg, #1d4ed8, #4338ca)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
              🖨️ إعادة طباعة الدفعة المسترجعة
            </button>
          </div>
        )}

        {printRetryAvailable && printedCards.length > 0 && (
          <div role="status" style={{ marginBottom: '18px', padding: '18px', borderRadius: '16px', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.55)', color: '#e2e8f0' }}>
            <div style={{ fontWeight: 800, marginBottom: '8px', color: '#6ee7b7' }}>تم حفظ الدفعة — الطباعة لم تكتمل</div>
            <p style={{ fontSize: '14px', lineHeight: 1.8, marginBottom: '12px' }}>أعد تجهيز صفحة الطباعة للدفعة نفسها. لن يُرسل طلب حفظ جديد ولن يُخصم الرصيد مرة أخرى.</p>
            <button
              onClick={async () => {
                const prepared = await exportSamplePDF(printedCards, true, undefined, batchPrintSnapshot?.settings || formData)
                if (prepared) {
                  setPrintRetryAvailable(false)
                  alert('تم تجهيز صفحة الطباعة للدفعة المحفوظة.')
                }
              }}
              style={{ width: '100%', padding: '13px 16px', border: '1px solid rgba(110,231,183,0.6)', borderRadius: '12px', background: 'linear-gradient(135deg, #047857, #059669)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
            >
              إعادة طباعة الدفعة المحفوظة
            </button>
          </div>
        )}

        {/* إعدادات الكرت */}
        <div className="print-cards-settings" data-active-step={activeStudioSection} style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(124,58,237,0.30)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>⚙️</span> إعدادات الكرت
          </h2>

          <InputRow activeField={activeField} label="البروفايل" icon="👤" fieldId="profile">
            <select value={formData.profile} onChange={(e) => { setFormData({...formData, profile: e.target.value}); setActiveField('profile') }} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }}>
              <option value="DEFAULT">DEFAULT</option>
              <option value="PREMIUM">PREMIUM</option>
              <option value="BASIC">BASIC</option>
            </select>
          </InputRow>

          <InputRow activeField={activeField} label="الصلاحية" icon="✓" fieldId="validity">
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={formData.validity} onChange={(e) => { setFormData({...formData, validity: e.target.value.replace(/[^0-9]/g, '')}); setActiveField('validity') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
              <select value={formData.validityType} onChange={(e) => { setFormData({...formData, validityType: e.target.value}); setActiveField('validity') }} style={{ flex: 2, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                <option value="no-expiry">بدون مدة</option>
                <option value="hour">ساعة</option>
                <option value="day">يوم</option>
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
              </select>
            </div>
          </InputRow>

          <InputRow activeField={activeField} label="مدة المستخدم" icon="⏱️" fieldId="userDuration">
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={formData.userDuration} onChange={(e) => { setFormData({...formData, userDuration: e.target.value.replace(/[^0-9]/g, '')}); setActiveField('userDuration') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
              <select value={formData.userDurationType} onChange={(e) => { setFormData({...formData, userDurationType: e.target.value}); setActiveField('userDuration') }} style={{ flex: 2, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                <option value="no-expiry">بدون مدة</option>
                <option value="hour">ساعة</option>
                <option value="day">يوم</option>
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
              </select>
            </div>
          </InputRow>

          <InputRow activeField={activeField} label="باقة البيانات" icon="💾" fieldId="dataPackage">
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <select value={formData.dataPackage} onChange={(e) => { setFormData({...formData, dataPackage: e.target.value}); setActiveField('dataPackage') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                <option value="unlimited">بدون حد</option>
                <option value="limited">محدد</option>
              </select>
              {formData.dataPackage === 'limited' && (
                <>
                  <input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={formData.dataAmount} onChange={(e) => { setFormData({...formData, dataAmount: e.target.value.replace(/[^0-9]/g, '')}); setActiveField('dataPackage') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
                  <select value={formData.dataUnit} onChange={(e) => { setFormData({...formData, dataUnit: e.target.value}); setActiveField('dataPackage') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                    <option value="MB">MB</option>
                    <option value="GB">GB</option>
                  </select>
                </>
              )}
            </div>
          </InputRow>

          <InputRow activeField={activeField} label="اسم الشبكة" icon="🌐" fieldId="network">
            <input type="text" value={formData.networkName} onChange={(e) => { setFormData({...formData, networkName: e.target.value}); setActiveField('network') }} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow activeField={activeField} label="وقت الكرت" icon="" fieldId="cardTime">
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={formData.cardTime} onChange={(e) => { setFormData({...formData, cardTime: e.target.value.replace(/[^0-9]/g, '')}); setActiveField('cardTime') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
              <select value={formData.cardTimeType} onChange={(e) => { setFormData({...formData, cardTimeType: e.target.value}); setActiveField('cardTime') }} style={{ flex: 2, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                <option value="hour">ساعة</option>
                <option value="day">يوم</option>
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
              </select>
            </div>
          </InputRow>

          <InputRow activeField={activeField} label="سعر الكرت" icon="💰" fieldId="price">
            <input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={formData.cardPrice} onChange={(e) => { setFormData({...formData, cardPrice: e.target.value.replace(/[^0-9]/g, '')}); setActiveField('price') }} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(183,243,74,0.65)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow activeField={activeField} label="الموزع" icon="" fieldId="distributor">
            <input type="text" value={formData.distributor} onChange={(e) => { setFormData({...formData, distributor: e.target.value}); setActiveField('distributor') }} placeholder="عبدالرحمن" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow activeField={activeField} label="بداية اسم المستخدم" icon="🔢" fieldId="prefix">
            <input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={formData.usernamePrefix} onChange={(e) => { setFormData({...formData, usernamePrefix: e.target.value.replace(/[^0-9]/g, '')}); setActiveField('prefix') }} placeholder="86" maxLength={5} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow activeField={activeField} label={`عدد الأرقام: ${formData.usernameLength}`} icon="" fieldId="length">
            <input type="range" min="6" max="20" value={formData.usernameLength} onChange={(e) => { setFormData({...formData, usernameLength: parseInt(e.target.value)}); setActiveField('length') }} style={{ flex: 1 }} />
          </InputRow>

          <InputRow activeField={activeField} label="لون اسم المستخدم" icon="🎨" fieldId="usernameColor">
            <input type="color" value={formData.usernameColor} onChange={(e) => { setFormData({...formData, usernameColor: e.target.value}); setActiveField('usernameColor') }} style={{ flex: 1, height: '45px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
          </InputRow>

          <InputRow activeField={activeField} label="عدد الكروت" icon="📦" fieldId="count">
            <input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={cardsCountDraft} onChange={(e) => {
              const next = e.target.value.replace(/[^0-9]/g, '').slice(0, 5)
              setCardsCountDraft(next)
              if (next !== '' && Number(next) >= 1 && Number(next) <= 10000) setFormData((current) => ({ ...current, cardsCount: Number(next) }))
              setActiveField('count')
            }} onBlur={() => {
              const parsed = Number(cardsCountDraft)
              if (!cardsCountDraft || !Number.isInteger(parsed) || parsed < 1 || parsed > 10000) {
                setCardsCountDraft(String(formData.cardsCount))
              }
            }} aria-label="عدد الكروت من 1 إلى 10000" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '16px', textAlign: 'center', minWidth: 0 }} />
          </InputRow>

          <InputRow activeField={activeField} label="عدد الأعمدة" icon="" fieldId="cols">
            <input type="text" inputMode="numeric" pattern="[0-9]*" autoComplete="off" value={colsCountDraft} onChange={(e) => {
              const next = e.target.value.replace(/[^0-9]/g, '').slice(0, 2)
              setColsCountDraft(next)
              if (next !== '' && Number(next) >= 1 && Number(next) <= 6) setFormData((current) => ({ ...current, colsCount: Number(next) }))
              setActiveField('cols')
            }} onBlur={() => {
              const parsed = Number(colsCountDraft)
              if (!colsCountDraft || !Number.isInteger(parsed) || parsed < 1 || parsed > 6) {
                setColsCountDraft(String(formData.colsCount))
              }
            }} aria-label="عدد الأعمدة من 1 إلى 6" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '16px', textAlign: 'center', minWidth: 0 }} />
          </InputRow>

          <section id="studio-section-templates" aria-label="مكتبة قوالب التصميم" style={{ margin: '18px 0 22px', padding: '14px', borderRadius: '16px', background: 'rgba(15,23,42,.42)', border: '1px solid rgba(214,173,85,.35)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
              <h3 style={{ margin: 0, color: '#f3d58a', fontSize: '16px', fontWeight: 800 }}>✦ مكتبة قوالب جساس</h3>
              <span style={{ color: '#94a3b8', fontSize: '11px' }}>قوالب جاهزة قابلة للتعديل</span>
            </div>
            <p style={{ margin: '0 0 12px', color: '#cbd5e1', fontSize: '12px', lineHeight: 1.7 }}>اختر نقطة بداية، ثم عدّل الألوان والخطوط والخانات بحرية. القالب يغيّر المظهر فقط ولا يغيّر بيانات الشبكة أو إعدادات إنشاء الكروت.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px' }}>
              {CARD_DESIGN_TEMPLATES.map((template) => {
                const selected = activeDesignTemplate === template.id
                const swatch = template.id === 'classic-clean'
                  ? 'linear-gradient(135deg,#fff,#e5e7eb)'
                  : template.id === 'sky-minimal'
                    ? 'linear-gradient(135deg,#fff,#bfdbfe,#2563eb)'
                    : template.id === 'emerald-gold'
                      ? 'linear-gradient(135deg,#134e4a,#65a30d,#facc15)'
                      : template.id === 'purple-silver'
                        ? 'linear-gradient(135deg,#312e81,#8b5cf6,#cbd5e1)'
                        : template.id === 'midnight-gold'
                          ? 'linear-gradient(135deg,#020617,#1e293b,#facc15)'
                          : template.id === 'royal-luxury'
                            ? 'linear-gradient(135deg,#071b3a,#123f78,#d6ad55)'
                            : 'linear-gradient(135deg,#1e3c72,#2a5298,#d4af37)'
                return (
                  <button key={template.id} type="button" aria-pressed={selected}
                    onClick={() => {
                      setFormData((current) => ({
                        ...current,
                        cardStyle: template.cardStyle,
                        colorScheme: template.colorScheme,
                        cardEffect: template.cardEffect,
                        cardShape: template.cardShape,
                        borderWidth: template.borderWidth,
                        borderColor: template.borderColor,
                        usernameColor: template.accent,
                        fontFamily: template.fontFamily,
                        textStyles: {
                          ...current.textStyles,
                          network: { ...current.textStyles.network, color: template.textColor, fontFamily: template.fontFamily },
                          username: { ...current.textStyles.username, color: template.accent, fontFamily: template.fontFamily },
                        },
                      }))
                      setActiveDesignTemplate(template.id)
                      setActiveField('cardStyle')
                    }}
                    style={{ display: 'flex', alignItems: 'center', gap: '9px', minWidth: 0, minHeight: '64px', padding: '9px', textAlign: 'right', borderRadius: '12px', border: selected ? '2px solid #f7d77a' : '1px solid rgba(148,163,184,.28)', background: selected ? 'rgba(37,99,235,.2)' : 'rgba(15,23,42,.58)', color: '#f8fafc', cursor: 'pointer' }}>
                    <span aria-hidden="true" style={{ width: '32px', height: '32px', flex: '0 0 32px', borderRadius: '9px', background: swatch, border: '1px solid rgba(255,255,255,.35)' }} />
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                      <strong style={{ fontSize: '12px', lineHeight: 1.4 }}>{template.name}</strong>
                      <small style={{ color: '#cbd5e1', fontSize: '10px', lineHeight: 1.4 }}>{template.note}</small>
                    </span>
                    <span aria-hidden="true" style={{ marginInlineStart: 'auto', color: selected ? '#6ee7b7' : '#64748b', fontWeight: 900 }}>{selected ? '✓' : ''}</span>
                  </button>
                )
              })}
            </div>
          </section>

          {/* أوضاع التصميم الأربعة المعتمدة */}
          <h3 id="studio-section-design" style={{ color: '#FFD700', margin: '25px 0 15px 0', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid rgba(124,58,237,0.45)', paddingBottom: '10px' }}>🎨 أوضاع تصميم الكرت</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px', marginBottom: '14px' }}>
            {([
              { value: 'plain', title: 'كروت عادي', detail: 'نظيف وعملي بلا زخارف أو ألوان تصميم', active: 'linear-gradient(135deg,#e5e7eb,#9ca3af)', ink: '#111827' },
              { value: 'luxury', title: 'كروت عادي فاخر', detail: 'إطارات وزخارف راقية بألوان هادئة', active: 'linear-gradient(135deg,#123f78,#d6ad55)', ink: '#fffaf0' },
              { value: 'three-color', title: 'كروت ملونه', detail: 'تدرج متناسق من 3 إلى 4 ألوان', active: 'linear-gradient(135deg,#2563eb,#7c3aed)', ink: '#ffffff' },
              { value: 'colored', title: 'كروت ملونه فخمه', detail: 'لوحات ألوان وصورة خلفية وتأثيرات كاملة', active: 'linear-gradient(135deg,#0f766e,#2563eb,#d4af37)', ink: '#ffffff' },
            ] as const).map((mode) => {
              const selected = formData.cardStyle === mode.value
              return (
                <button key={mode.value} type="button" aria-pressed={selected}
                  onClick={() => { setFormData((current) => ({ ...current, cardStyle: mode.value })); setActiveField('cardStyle') }}
                  style={{ minHeight: '88px', padding: '12px', textAlign: 'right', borderRadius: '12px',
                    border: selected ? '2px solid #f7d77a' : '1px solid rgba(148,163,184,.35)',
                    background: selected ? mode.active : 'rgba(15,23,42,.62)',
                    color: selected ? mode.ink : '#f8fafc', boxShadow: selected ? '0 8px 22px rgba(0,0,0,.22)' : 'none', cursor: 'pointer' }}>
                  <span style={{ display: 'block', fontWeight: 800, fontSize: '14px', marginBottom: '5px' }}>{mode.title}</span>
                  <span style={{ display: 'block', fontSize: '11px', lineHeight: 1.5, opacity: .88 }}>{mode.detail}</span>
                </button>
              )
            })}
          </div>

          {formData.cardStyle === 'colored' && (
            <InputRow activeField={activeField} label="نظام الألوان" icon="🌈" fieldId="colorScheme">
              <select value={formData.colorScheme} onChange={(e) => { setFormData({...formData, colorScheme: e.target.value}); setActiveField('colorScheme') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                {Object.keys(colorSchemes).map((key: string) => (
                  <option key={key} value={key}>
                    {key === 'blue-gold' && 'أزرق ذهبي'}
                    {key === 'purple-silver' && 'بنفسجي فضي'}
                    {key === 'green-gold' && 'أخضر ذهبي'}
                    {key === 'red-black' && 'أحمر أسود'}
                    {key === 'orange-dark' && 'برتقالي داكن'}
                    {key === 'blue-green' && 'أزرق أخضر'}
                    {key === 'pure-blue' && 'أزرق صافي'}
                    {key === 'pure-green' && 'أخضر صافي'}
                    {key === 'black-gold' && 'أسود ذهبي'}
                    {key === 'white-blue' && 'أبيض أزرق'}
                    {key === 'lime-green' && 'أخضر ليموني'}
                  </option>
                ))}
              </select>
            </InputRow>
          )}

          {formData.cardStyle === 'colored' && (
            <InputRow activeField={activeField} label="صورة خلفية" icon="🖼️" fieldId="cardBackgroundImage">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: 0 }}>
                <input type="file" accept="image/jpeg,image/png,image/webp" aria-label="اختيار صورة خلفية للكرت"
                  onChange={async (event) => {
                    const file = event.target.files?.[0]
                    if (!file) return
                    try {
                      const compressed = await compressCardBackground(file)
                      setFormData((current) => ({ ...current, cardBackgroundImage: compressed }))
                      setActiveField('cardBackgroundImage')
                    } catch (error) {
                      alert(error instanceof Error ? error.message : 'تعذر تجهيز الصورة.')
                    } finally {
                      event.target.value = ''
                    }
                  }}
                  style={{ width: '100%', color: '#e2e8f0', fontSize: '12px' }} />
                <div style={{ color: '#cbd5e1', fontSize: '11px', lineHeight: 1.6 }}>صورة JPG أو PNG أو WEBP؛ يتم ضغطها تلقائياً قبل حفظ التصميم.</div>
                {formData.cardBackgroundImage && <button type="button"
                  onClick={() => setFormData((current) => ({ ...current, cardBackgroundImage: '' }))}
                  style={{ alignSelf: 'flex-start', padding: '7px 10px', borderRadius: '8px', border: '1px solid rgba(248,113,113,.55)', background: 'rgba(127,29,29,.25)', color: '#fecaca', cursor: 'pointer' }}>
                  إزالة صورة الخلفية
                </button>}
              </div>
            </InputRow>
          )}

          {formData.cardStyle !== 'plain' && (
          <InputRow activeField={activeField} label="التأثير" icon="✨" fieldId="cardEffect">
            <select value={formData.cardEffect} onChange={(e) => { setFormData({...formData, cardEffect: e.target.value}); setActiveField('cardEffect') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
              <option value="plain">عادي</option>
              <option value="gradient">مدرج</option>
              <option value="3d">3D</option>
              <option value="shadow">مظل</option>
              <option value="glow">موهج</option>
            </select>
          </InputRow>
          )}

          <InputRow activeField={activeField} label="شكل الكرت" icon="📱" fieldId="cardShape">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px', flex: 1 }}>
              {([
                { value: 'rectangle', label: 'مستطيل', icon: '▭' },
                { value: 'square', label: 'مربع', icon: '□' },
              ] as const).map((shape) => {
                const selected = formData.cardShape === shape.value
                return (
                  <button key={shape.value} type="button" aria-pressed={selected}
                    onClick={() => { setFormData((current) => ({ ...current, cardShape: shape.value })); setActiveField('cardShape') }}
                    style={{ minHeight: '42px', padding: '8px', background: selected ? 'linear-gradient(135deg, #FFD700, #7c3aed)' : 'rgba(0,0,0,0.5)', color: selected ? '#0f172a' : '#fff', border: selected ? '2px solid #f7d77a' : '1px solid rgba(148,163,184,.3)', borderRadius: '9px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>
                    <span aria-hidden="true" style={{ marginInlineEnd: '6px' }}>{shape.icon}</span>{shape.label}
                  </button>
                )
              })}
            </div>
          </InputRow>

          <InputRow activeField={activeField} label="نوع الإطار" icon="框" fieldId="borderStyle">
            <select value={formData.borderStyle} onChange={(e) => { setFormData({...formData, borderStyle: e.target.value}); setActiveField('borderStyle') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
              <option value="solid">متصل ━</option>
              <option value="dashed">متقطع ┄</option>
              <option value="dotted">منقط ┈</option>
            </select>
          </InputRow>

          <InputRow activeField={activeField} label={`سمك الإطار: ${formData.borderWidth}px`} icon="" fieldId="borderWidth">
            <input type="range" min="1" max="8" value={formData.borderWidth} onChange={(e) => { setFormData({...formData, borderWidth: parseInt(e.target.value)}); setActiveField('borderWidth') }} style={{ flex: 1 }} />
          </InputRow>

          <InputRow activeField={activeField} label="QR Code" icon="📱" fieldId="qr">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <input type="checkbox" checked={formData.enableQR} onChange={(e) => { setFormData({...formData, enableQR: e.target.checked}); setActiveField('qr') }} style={{ width: '22px', height: '22px', cursor: 'pointer' }} />
              <span style={{ color: '#e2e8f0', fontSize: '14px' }}>تفعيل</span>
            </div>
          </InputRow>

          {formData.enableQR && (
            <InputRow activeField={activeField} label={`حجم QR: ${formData.qrSize}px`} icon="📐" fieldId="qrSize">
              <input type="range" min="40" max="80" value={formData.qrSize} onChange={(e) => { setFormData({...formData, qrSize: parseInt(e.target.value)}); setActiveField('qrSize') }} style={{ flex: 1 }} />
            </InputRow>
          )}

          <InputRow activeField={activeField} label="نص الشحن" icon="⚡" fieldId="recharge">
            <input type="text" value={formData.rechargeText} onChange={(e) => { setFormData({...formData, rechargeText: e.target.value}); setActiveField('recharge') }} placeholder="بنكك، تحويل، يوجد شحن..." style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow activeField={activeField} label="عرض خاص" icon="" fieldId="special">
            <textarea value={formData.specialOffer} onChange={(e) => { setFormData({...formData, specialOffer: e.target.value}); setActiveField('special') }} rows={2} placeholder="للتواصل: 0123456789" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '14px', resize: 'vertical', textAlign: 'center' }} />
          </InputRow>

          <InputRow activeField={activeField} label="عبارة حرة على الكرت" icon="✨" fieldId="customMessage">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <textarea
                value={formData.customMessage}
                maxLength={240}
                onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                rows={2}
                placeholder="مثال: رمضان كريم، عيد سعيد، كل عام وأنتم بخير..."
                style={{ width: '100%', boxSizing: 'border-box', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(214,173,85,0.55)', borderRadius: '10px', color: '#fff', fontSize: '14px', resize: 'vertical', textAlign: 'center' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e2e8f0' }}>
                  <input
                    type="checkbox"
                    checked={formData.textStyles.customMessage.show}
                    onChange={(e) => setFormData({
                      ...formData,
                      textStyles: {
                        ...formData.textStyles,
                        customMessage: {
                          ...formData.textStyles.customMessage,
                          show: e.target.checked
                        }
                      }
                    })}
                  />
                  إظهار العبارة على الكرت
                </label>
                <span style={{ color: '#cbd5e1', fontSize: '12px' }}>
                  {formData.customMessage.length}/240
                </span>
              </div>
            </div>
          </InputRow>


          {/* محرر تنسيق النصوص */}
          <section
            id="studio-section-typography"
            aria-label="محرر تنسيق النصوص"
            style={{
              marginTop: '24px',
              padding: '18px',
              borderRadius: '16px',
              background: 'rgba(15,23,42,0.48)',
              border: '1px solid rgba(214,173,85,0.55)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.16)'
            }}
          >
            <h3 style={{
              color: '#f3d58a',
              fontSize: '18px',
              fontWeight: 800,
              margin: '0 0 8px'
            }}>
              ✨ محرر تنسيق النصوص
            </h3>
            <p style={{
              color: '#cbd5e1',
              fontSize: '13px',
              lineHeight: 1.7,
              margin: '0 0 15px'
            }}>
              اختر أي خانة وعدّل مظهرها. التغييرات تظهر مباشرة في المعاينة.
            </p>

            <label style={{
              display: 'block',
              color: '#e2e8f0',
              fontSize: '13px',
              fontWeight: 700,
              marginBottom: '7px'
            }}>
              الخانة المراد تنسيقها
            </label>

            <select
              value={selectedTextStyleKey}
              onChange={(e) => setSelectedTextStyleKey(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                marginBottom: '16px',
                background: '#172554',
                color: '#fff',
                border: '1px solid rgba(214,173,85,0.55)',
                borderRadius: '10px',
                fontSize: '15px'
              }}
            >
              <option value="network">اسم الشبكة</option>
              <option value="username">رقم الكرت / اسم المستخدم</option>
              <option value="validity">الصلاحية</option>
              <option value="time">الوقت</option>
              <option value="data">حجم البيانات</option>
              <option value="price">السعر</option>
              <option value="distributor">اسم الموزع</option>
              <option value="offer">العرض الخاص</option>
              <option value="recharge">نص الشحن</option>
              <option value="customMessage">العبارة الحرة</option>
              <option value="warning">التنبيه</option>
            </select>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.06)'
            }}>
              <span style={{ color: '#f8fafc', fontSize: '14px', fontWeight: 700 }}>
                إظهار هذه الخانة على الكرت
              </span>
              <input
                type="checkbox"
                checked={selectedTextStyle.show !== false}
                onChange={(e) => setFormData({
                  ...formData,
                  textStyles: {
                    ...formData.textStyles,
                    [selectedTextStyleKey]: {
                      ...selectedTextStyle,
                      show: e.target.checked
                    }
                  }
                })}
                style={{ width: '22px', height: '22px' }}
              />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <label style={{ color: '#e2e8f0', fontSize: '13px' }}>
                حجم الخط: {selectedTextStyle.fontSize}px
                <input
                  type="range"
                  min="8"
                  max="40"
                  value={selectedTextStyle.fontSize}
                  onChange={(e) => setFormData({
                    ...formData,
                    textStyles: {
                      ...formData.textStyles,
                      [selectedTextStyleKey]: {
                        ...selectedTextStyle,
                        fontSize: Number(e.target.value)
                      }
                    }
                  })}
                  style={{ width: '100%', marginTop: '9px' }}
                />
              </label>

              <label style={{ color: '#e2e8f0', fontSize: '13px' }}>
                لون الكتابة
                <input
                  type="color"
                  value={selectedTextStyle.color}
                  onChange={(e) => setFormData({
                    ...formData,
                    textStyles: {
                      ...formData.textStyles,
                      [selectedTextStyleKey]: {
                        ...selectedTextStyle,
                        color: e.target.value
                      }
                    }
                  })}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '38px',
                    marginTop: '5px',
                    border: 0,
                    borderRadius: '8px',
                    background: 'transparent'
                  }}
                />
              </label>

              <label style={{ color: '#e2e8f0', fontSize: '13px' }}>
                نوع الخط
                <select
                  value={selectedTextStyle.fontFamily}
                  onChange={(e) => setFormData({
                    ...formData,
                    textStyles: {
                      ...formData.textStyles,
                      [selectedTextStyleKey]: {
                        ...selectedTextStyle,
                        fontFamily: e.target.value
                      }
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '5px',
                    background: '#172554',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '8px'
                  }}
                >
                  <option value="default">افتراضي</option>
                  <option value="arabic">عربي واضح</option>
                  <option value="kufi">كوفي</option>
                  <option value="naskh">نسخ</option>
                  <option value="system">خط النظام</option>
                  <option value="sans">حديث</option>
                  <option value="serif">كلاسيكي</option>
                  <option value="mono">رقمي</option>
                </select>
              </label>

              <label style={{ color: '#e2e8f0', fontSize: '13px' }}>
                محاذاة الكتابة
                <select
                  value={selectedTextStyle.align}
                  onChange={(e) => setFormData({
                    ...formData,
                    textStyles: {
                      ...formData.textStyles,
                      [selectedTextStyleKey]: {
                        ...selectedTextStyle,
                        align: e.target.value
                      }
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '5px',
                    background: '#172554',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '8px'
                  }}
                >
                  <option value="right">يمين</option>
                  <option value="center">وسط</option>
                  <option value="left">يسار</option>
                </select>
              </label>

              <label style={{ color: '#e2e8f0', fontSize: '13px' }}>
                سمك الإطار: {selectedTextStyle.borderWidth}px
                <input
                  type="range"
                  min="0"
                  max="6"
                  value={selectedTextStyle.borderWidth}
                  onChange={(e) => setFormData({
                    ...formData,
                    textStyles: {
                      ...formData.textStyles,
                      [selectedTextStyleKey]: {
                        ...selectedTextStyle,
                        borderWidth: Number(e.target.value)
                      }
                    }
                  })}
                  style={{ width: '100%', marginTop: '9px' }}
                />
              </label>

              <label style={{ color: '#e2e8f0', fontSize: '13px' }}>
                لون الإطار
                <input
                  type="color"
                  value={selectedTextStyle.borderColor}
                  onChange={(e) => setFormData({
                    ...formData,
                    textStyles: {
                      ...formData.textStyles,
                      [selectedTextStyleKey]: {
                        ...selectedTextStyle,
                        borderColor: e.target.value
                      }
                    }
                  })}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '38px',
                    marginTop: '5px',
                    border: 0,
                    borderRadius: '8px',
                    background: 'transparent'
                  }}
                />
              </label>

              <label style={{ color: '#e2e8f0', fontSize: '13px' }}>
                شكل الإطار
                <select
                  value={selectedTextStyle.borderStyle}
                  onChange={(e) => setFormData({
                    ...formData,
                    textStyles: {
                      ...formData.textStyles,
                      [selectedTextStyleKey]: {
                        ...selectedTextStyle,
                        borderStyle: e.target.value
                      }
                    }
                  })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    marginTop: '5px',
                    background: '#172554',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.18)',
                    borderRadius: '8px'
                  }}
                >
                  <option value="solid">متصل</option>
                  <option value="dashed">متقطع</option>
                  <option value="dotted">منقط</option>
                </select>
              </label>

              <label style={{ color: '#e2e8f0', fontSize: '13px' }}>
                خلفية النص
                <input
                  type="color"
                  value={selectedTextStyle.background !== 'transparent'
                    ? selectedTextStyle.background
                    : '#172554'}
                  onChange={(e) => setFormData({
                    ...formData,
                    textStyles: {
                      ...formData.textStyles,
                      [selectedTextStyleKey]: {
                        ...selectedTextStyle,
                        background: e.target.value
                      }
                    }
                  })}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: '38px',
                    marginTop: '5px',
                    border: 0,
                    borderRadius: '8px',
                    background: 'transparent'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    textStyles: {
                      ...formData.textStyles,
                      [selectedTextStyleKey]: {
                        ...selectedTextStyle,
                        background: 'transparent'
                      }
                    }
                  })}
                  style={{
                    marginTop: '7px',
                    padding: '6px 9px',
                    color: '#e2e8f0',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '7px'
                  }}
                >
                  بدون خلفية
                </button>
              </label>
            </div>
          </section>


          {/* أزرار الإنشاء */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '25px' }}>
            <button onClick={generateCards} style={{ padding: '18px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#0f172a', fontSize: '17px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 25px rgba(124,58,237,0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              🖨️ إنشاء الكروت
            </button>
            <button onClick={() => { void exportSamplePDF() }} style={{ padding: '18px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', fontSize: '17px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 25px rgba(124,58,237,0.3)', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
               طباعة عينة PDF
            </button>
          </div>
        </div>
          </>
        )}


        {/* نافذة تأكيد الكمية */}
        {showConfirm && printedCards.length > 0 && (
          <div className="print-cards-modal" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
            <div className="print-cards-modal-card" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '25px', padding: '30px', maxWidth: '500px', width: '100%', border: '2px solid rgba(124,58,237,0.45)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
              <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                <div style={{ fontSize: '60px', marginBottom: '15px' }}>🖨️</div>
                <h2 style={{ color: '#FFD700', margin: '0 0 10px 0', fontSize: '24px' }}>تأكيد طباعة الكروت</h2>
                <p style={{ color: '#94a3b8', margin: 0, fontSize: '14px' }}>هل تريد طباعة الكروت بالكمية المحددة؟</p>
              </div>
              <div style={{ background: 'rgba(0,255,255,0.1)', borderRadius: '15px', padding: '20px', marginBottom: '25px', border: '1px solid rgba(124,58,237,0.45)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#94a3b8' }}>الشبكة:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{formData.networkName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#94a3b8' }}>الكمية:</span>
                  <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px' }}>{printedCards.length} كرت</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#94a3b8' }}>المدة:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{formData.cardTime} {timeLabels[formData.cardTimeType]}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ color: '#94a3b8' }}>السعة:</span>
                  <span style={{ color: '#fff', fontWeight: 'bold' }}>{formData.dataPackage === 'unlimited' ? 'بدون حد' : formData.dataAmount + ' ' + formData.dataUnit}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>السعر:</span>
                  <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '18px' }}>{formData.cardPrice} جنيه</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button onClick={() => void confirmAndPrint()} disabled={isSaving} style={{ padding: '15px', background: isSaving ? '#64748b' : 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: 'none', cursor: isSaving ? 'wait' : 'pointer', opacity: isSaving ? 0.7 : 1, boxShadow: '0 5px 20px rgba(16,185,129,0.4)' }}>
                  {isSaving ? '⏳ جارٍ حفظ الكروت...' : '✅ تأكيد الطباعة'}
                </button>
                <button onClick={() => setShowConfirm(false)} style={{ padding: '15px', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '16px', fontWeight: 'bold', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                  ❌ إلغاء
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
