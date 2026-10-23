"use client"
import { useState, useEffect, useRef, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import QRCodeGenerator from 'qrcode'
import { createClient } from '@/lib/supabase/client'

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

export default function PrintCardsPage() {
  const [user, setUser] = useState<any>(null)
  const [printedCards, setPrintedCards] = useState<any[]>([])
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [printRetryAvailable, setPrintRetryAvailable] = useState(false)
  const [activeField, setActiveField] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    profile: 'DEFAULT',
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
        : style === "three-color"
          ? {
              bg: "linear-gradient(135deg, #ffffff 0%, #eef2ff 58%, #dbeafe 78%, #7c3aed 100%)",
              accent: "#2563eb",
              text: "#172033",
              border: "#7c3aed"
            }
          : (colorSchemes[scheme] || colorSchemes["blue-gold"])

    const light = style === "plain" || style === "three-color"

    return {
      ...base,
      panel: light ? "#f3f4f6" : "rgba(0,0,0,0.3)",
      panelStrong: light ? "#ffffff" : "rgba(0,0,0,0.3)",
      panelAlt: light ? "#f8fafc" : "rgba(255,255,255,0.1)",
      labelText: light ? "#4b5563" : "#e5e7eb",
      infoText: light ? "#111827" : base.text,
      numberText: light ? "#111827" : base.accent,
      offerBg: light ? "#ede9fe" : "rgba(255,215,0,0.2)",
      offerText: light ? "#5b21b6" : "#FFD700",
      rechargeBg: light
        ? "linear-gradient(135deg, #2563eb, #7c3aed)"
        : "linear-gradient(135deg, #2563eb, #7c3aed)",
      rechargeText: "#ffffff"
    }
  }

  const fontFamilies: any = {
    'default': 'Segoe UI, Tahoma, Arial, sans-serif',
    'arabic': 'Arial, Tahoma, sans-serif',
    'mono': 'Courier New, monospace',
    'serif': 'Georgia, serif',
    'sans': 'Helvetica, Arial, sans-serif'
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
    labelColor: formData.labelColor,
    borderWidth: formData.borderWidth,
    borderStyle: formData.borderStyle,
    borderColor: formData.borderColor,
    fontFamily: fontFamilies[formData.fontFamily]
  }

  const getCardStyle = (card: any, isActive: boolean = false) => {
    const c = card.colors
    let bg = c.bg
    let radius = '15px'
    if (card.cardShape === 'square') radius = '10px'
    if (card.cardShape === 'rounded') radius = '25px'
    let shadow = '0 10px 30px rgba(0,0,0,0.3)'
    let border = card.borderWidth + 'px ' + card.borderStyle + ' ' + c.border
    let extraStyle: any = {}
    if (card.cardEffect === '3d') {
      shadow = '0 20px 50px rgba(0,0,0,0.5), inset 0 2px 10px rgba(255,255,255,0.3), inset 0 -2px 10px rgba(0,0,0,0.2)'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    } else if (card.cardEffect === 'shadow') {
      shadow = '0 25px 60px rgba(0,0,0,0.6), 0 15px 40px rgba(0,0,0,0.4)'
    } else if (card.cardEffect === 'glow') {
      shadow = '0 0 30px ' + c.accent + ', 0 0 60px ' + c.accent + '88'
      border = (card.borderWidth + 2) + 'px ' + card.borderStyle + ' ' + c.accent
    }
    if (isActive) {
      shadow = '0 0 0 4px rgba(124,58,237,0.45), ' + shadow
      extraStyle.transform = 'scale(1.02)'
    }
    return {
      background: bg,
      boxShadow: shadow,
      borderRadius: radius,
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
    const qty = Math.floor(Number(formData.cardsCount)) || 100

    if (!Number.isFinite(qty) || qty < 1 || qty > 10000) {
      alert('حدد كمية بين 1 و10000 كرت.')
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
    setShowConfirm(true)
  }

  const confirmAndPrint = async () => {
    if (isSaving || printedCards.length === 0) return

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
      const printPrepared = await exportSamplePDF(printedCards, true, printWindow)
      if (printPrepared) {
        setPrintRetryAvailable(false)
        alert(`تم حفظ ${result.saved_count} كرت وتجهيز صفحة الطباعة. الرصيد المتبقي: ${result.cards_remaining ?? 'غير متاح'}.`)
      } else {
        setPrintRetryAvailable(true)
        alert('تم حفظ الدفعة بالفعل، لكن تعذّر تجهيز الطباعة. استخدم زر إعادة طباعة الدفعة المحفوظة؛ لا تنشئ دفعة جديدة.')
      }
    } catch (error) {
      printWindow.close()
      console.error('Card save failed:', error)
      alert('تعذّر تأكيد نتيجة الطلب بسبب مشكلة اتصال. قد يكون الحفظ قد اكتمل؛ تحقّق من سجل الكروت والرصيد قبل أي محاولة جديدة.')
    } finally {
      setIsSaving(false)
    }
  }

  const exportSamplePDF = async (
    cardsToPrint: any[] = [previewCard],
    batch = false,
    preopenedWindow?: Window | null
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
    let radius = '15px'
    if (card.cardShape === 'square') radius = '10px'
    if (card.cardShape === 'rounded') radius = '25px'
    const cardHTML = `
      <div style="position: relative; overflow: hidden; background: ${bg}; border-radius: ${radius}; border: ${card.borderWidth}px ${card.borderStyle} ${c.border}; padding: 20px; width: 100%; box-sizing: border-box; margin: 0; break-inside: avoid; page-break-inside: avoid; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%) rotate(-25deg); width:95%; text-align:center; font-size:16px; line-height:1.8; font-weight:900; color:${c.accent}; opacity:0.12; pointer-events:none; z-index:0;">جساس نت كرت<br>JASSAS NET CARD</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
          <div style="flex: 1; text-align: center; padding: 12px; background: ${c.panelAlt}; border-radius: 12px; border: 2px solid ${c.accent};">
            <div style="font-size: 11px; color: ${c.text}; opacity: 0.9; margin-bottom: 5px;">🌐 الشبكة</div>
            <div style="font-size: ${card.networkFontSize}px; color: ${card.networkColor}; font-weight: bold;">${escapeHtml(card.network)}</div>
          </div>
          ${card.qrEnabled ? `<div style="background: #fff; padding: 4px; border-radius: 8px; margin-left: 10px; border: 2px solid ${c.accent};">
            <img src="${qrDataUrl}" width="${card.qrSize}" height="${card.qrSize}" alt="QR Code" style="display:block; width:${card.qrSize}px; height:${card.qrSize}px;" />
          </div>` : ''}
        </div>
        <div style="background: ${c.panel}; border-radius: 12px; padding: 15px; margin: 15px 0; border: 2px dashed ${c.accent}; text-align: center;">
          <div style="font-size: 11px; color: ${card.labelColor}; margin-bottom: 8px;">🔢 رقم الكرت / بيانات الدخول</div>
          <div style="font-size: ${card.cardNumberFontSize}px; color: ${card.usernameColor}; font-weight: bold; font-family: monospace; letter-spacing: 3px; background: ${c.panel}; padding: 10px; border-radius: 8px;">${escapeHtml(card.username)}</div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: ${card.infoFontSize}px;">
          <div style="background: ${c.panel}; padding: 10px; border-radius: 10px; text-align: center; border: 1px solid ${c.accent};">
            <div style="font-size: 10px; color: ${card.labelColor}; margin-bottom: 4px;">⏱️ الصلاحية</div>
            <div style="font-weight: bold; color: ${card.infoColor};">${escapeHtml(card.validity)}</div>
          </div>
          <div style="background: ${c.panel}; padding: 10px; border-radius: 10px; text-align: center; border: 1px solid ${c.accent};">
            <div style="font-size: 10px; color: ${card.labelColor}; margin-bottom: 4px;">⏰ الوقت</div>
            <div style="font-weight: bold; color: ${card.infoColor};">${escapeHtml(card.cardTime)}</div>
          </div>
          <div style="background: ${c.panel}; padding: 10px; border-radius: 10px; text-align: center; border: 1px solid ${c.accent};">
            <div style="font-size: 10px; color: ${card.labelColor}; margin-bottom: 4px;">💾 البيانات</div>
            <div style="font-weight: bold; color: ${card.infoColor};">${escapeHtml(card.dataPackage)}</div>
          </div>
          <div style="background: ${c.panel}; padding: 10px; border-radius: 10px; text-align: center; border: 1px solid ${c.accent};">
            <div style="font-size: 10px; color: ${card.labelColor}; margin-bottom: 4px;">💰 السعر</div>
            <div style="font-weight: bold; color: ${card.infoColor};">${escapeHtml(card.price)}</div>
          </div>
        </div>
        ${card.distributor ? `<div style="text-align: center; margin-top: 10px; font-size: 11px; color: ${card.labelColor}; background: ${c.panelAlt}; padding: 6px; border-radius: 8px;">الموزع: ${escapeHtml(card.distributor)}</div>` : ''}
        ${card.rechargeText ? `<div style="background: ${c.rechargeBg}; color: #fff; padding: 8px; border-radius: 10px; text-align: center; margin-top: 10px; font-size: 12px; font-weight: bold; border: 1px solid ${c.accent};">⚡ ${escapeHtml(card.rechargeText)}</div>` : ''}
        ${card.specialOffer ? `<div style="background: ${c.offerBg}; color: ${c.offerText}; padding: 8px; border-radius: 10px; text-align: center; margin-top: 10px; font-size: 12px; border: 1px solid ${c.accent};">🎁 ${escapeHtml(card.specialOffer)}</div>` : ''}
        <div style="position:relative; z-index:1; margin-top:10px; padding:8px; text-align:center; font-size:10px; line-height:1.8; font-weight:600; color:${c.text}; background:${c.panelAlt}; border:1px solid ${c.accent}; border-radius:8px;">احتفظ بهذا الكرت بعد التسجيل لاستكمال المدة والاستفادة من الباقة كاملة</div>
            <div style="position:relative; z-index:1; text-align:center; margin-top:10px; padding-top:8px; border-top:1px solid ${c.accent}; font-size:10px; opacity:0.8; color:${c.text};">جساس نت كرت – JASSAS NET CARD</div>
      </div>
    `
    cardsHTML.push(cardHTML)
    }
    printWindow.document.write(`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"><title>عينة كرت - ${escapeHtml(formData.networkName)}</title><style>@page { size: A4; margin: 20mm; } body { font-family: Arial, Tahoma, sans-serif; background: #f5f5f5; padding: 20px; } .no-print { background: linear-gradient(135deg, #0f172a, #1e293b); color: #fff; padding: 20px; text-align: center; margin-bottom: 20px; border-radius: 12px; } .no-print button { padding: 12px 25px; margin: 5px; border: none; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; } @media print { body { padding: 0; background: #fff; } .no-print { display: none !important; } }</style></head><body><div class="no-print"><h2>🖨️ عينة الكرت - طباعة PDF</h2><p>اضغط Ctrl+P ثم اختر "حفظ كـ PDF"</p><button onclick="window.print()" style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: #0f172a;">️ طباعة / حفظ PDF</button><button onclick="window.close()" style="background: #ef4444; color: #fff;">إغلاق</button></div><div class="cards-grid" style="display:grid;grid-template-columns:repeat(${batch ? Math.max(1, Math.min(6, Number(formData.colsCount) || 3)) : 1},minmax(0,1fr));gap:12px;align-items:start;">${cardsHTML.join('')}</div></body></html>`)
    printWindow.document.close()
    return true
  }

  if (!user) {
    return <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a, #1e293b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}><p>جاري التحميل...</p></div>
  }

  const InputRow = ({ label, children, icon = '', fieldId = '' }: { label: string, children: any, icon?: string, fieldId?: string }) => (
    <div 
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

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #2d3748 100%)', padding: '15px', fontFamily: 'Segoe UI, Tahoma' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* الشعار */}
        <div style={{ textAlign: 'center', marginBottom: '20px', padding: '20px', background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 65%, #4338ca 100%)', borderRadius: '20px', boxShadow: '0 10px 40px rgba(102,126,234,0.4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <div style={{ fontSize: '40px' }}>📶</div>
            <div>
              <h1 style={{ color: '#FFD700', fontSize: '32px', margin: '0 0 3px 0', fontWeight: 'bold', textShadow: '0 3px 10px rgba(0,0,0,0.5)' }}>Jassas Net Card</h1>
              <p style={{ color: '#fff', fontSize: '13px', margin: 0, opacity: 0.9 }}>نظام إدارة شبكات المايكروتك الاحترافي</p>
            </div>
          </div>
        </div>

        {/* المعاينة الديناميكية - ثابتة في الأعلى */}
        <div ref={previewRef} style={{ 
          position: 'sticky', 
          top: '10px', 
          zIndex: 100, 
          marginBottom: '20px', 
          background: 'rgba(255,255,255,0.05)', 
          backdropFilter: 'blur(20px)', 
          borderRadius: '20px', 
          padding: '20px', 
          border: '2px solid rgba(124,58,237,0.45)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ color: '#FFD700', margin: 0, fontSize: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '24px' }}>👁️</span> معاينة الكرت (مباشرة)
            </h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => { void exportSamplePDF() }} style={{ padding: '8px 15px', background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#0f172a', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(37,99,235,0.30)' }}>
                📄 عينة PDF
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ ...getCardStyle(previewCard, activeField !== ''), maxWidth: '380px', width: '100%', position: 'relative', overflow: 'hidden' }}>
              <div aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-25deg)', width: '95%', textAlign: 'center', fontSize: '16px', opacity: 0.12, fontWeight: 900, whiteSpace: 'normal', lineHeight: 1.8, pointerEvents: 'none', zIndex: 0, color: previewCard.colors.accent }}>جساس نت كرت<br />JASSAS NET CARD</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1, marginBottom: '12px' }}>
                <div style={{ flex: 1, background: previewCard.colors.panelAlt, backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '10px 15px', textAlign: 'center', border: previewCard.borderWidth + 'px ' + previewCard.borderStyle + ' ' + previewCard.borderColor, marginRight: (previewCard.qrEnabled || previewCard.rechargeText) ? '10px' : '0', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, marginBottom: '4px' }}>🌐 الشبكة</div>
                  <h3 style={{ margin: 0, fontSize: previewCard.networkFontSize + 'px', color: previewCard.networkColor, fontWeight: 'bold', lineHeight: 1.2, textShadow: '0 3px 10px rgba(0,0,0,0.4)' }}>{previewCard.network}</h3>
                </div>
                {(previewCard.qrEnabled || previewCard.rechargeText) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
                    {previewCard.qrEnabled && (
                      <div style={{ background: '#fff', borderRadius: '10px', padding: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: '2px solid ' + previewCard.colors.accent }}>
                        <QRCode cardNumber={previewCard.username} size={previewCard.qrSize} />
                      </div>
                    )}
                    {previewCard.rechargeText && (
                      <div style={{ background: previewCard.colors.rechargeBg, borderRadius: '10px', padding: '6px 10px', boxShadow: '0 4px 15px rgba(37,99,235,0.35)', border: '1px solid ' + previewCard.colors.accent }}>
                        <div style={{ fontSize: '10px', color: '#fff', fontWeight: 'bold', whiteSpace: 'nowrap', textShadow: '0 2px 5px rgba(0,0,0,0.3)' }}> {previewCard.rechargeText}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ background: previewCard.colors.panel, backdropFilter: 'blur(10px)', borderRadius: '12px', padding: '12px', position: 'relative', zIndex: 1, border: '2px dashed ' + previewCard.colors.accent, marginBottom: '10px', boxShadow: 'inset 0 3px 10px rgba(0,0,0,0.3)' }}>
                <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, textAlign: 'center', marginBottom: '5px' }}>🔢 رقم الكرت / اسم المستخدم</div>
                <div style={{ fontSize: previewCard.cardNumberFontSize + 'px', fontWeight: 'bold', fontFamily: 'monospace', textAlign: 'center', letterSpacing: '3px', color: previewCard.usernameColor, textShadow: '0 3px 10px rgba(0,0,0,0.5)', background: previewCard.colors.panel, padding: '8px', borderRadius: '8px' }}>{previewCard.username}</div>
              </div>
              <div style={{ fontSize: previewCard.infoFontSize + 'px', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div style={{ background: previewCard.colors.panel, padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>⏱️ الصلاحية</div>
                  <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.validity}</div>
                </div>
                <div style={{ background: previewCard.colors.panel, padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>⏰ الوقت</div>
                  <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.cardTime}</div>
                </div>
                <div style={{ background: previewCard.colors.panel, padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>💾 البيانات</div>
                  <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.dataPackage}</div>
                </div>
                <div style={{ background: previewCard.colors.panel, padding: '8px', borderRadius: '10px', textAlign: 'center', border: '1px solid ' + previewCard.colors.accent, boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.2)' }}>
                  <div style={{ fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.8, marginBottom: '3px' }}>💰 السعر</div>
                  <div style={{ fontWeight: 'bold', color: previewCard.infoColor, fontSize: (previewCard.infoFontSize - 1) + 'px' }}>{previewCard.price}</div>
                </div>
              </div>
              {previewCard.distributor && <div style={{ textAlign: 'center', marginTop: '8px', fontSize: previewCard.labelFontSize + 'px', color: previewCard.labelColor, opacity: 0.9, position: 'relative', zIndex: 1, background: previewCard.colors.panelAlt, padding: '5px', borderRadius: '8px' }}>الموزع: {previewCard.distributor}</div>}
              {previewCard.specialOffer && <div style={{ marginTop: '8px', padding: '6px', background: previewCard.colors.offerBg, borderRadius: '8px', fontSize: previewCard.labelFontSize + 'px', textAlign: 'center', position: 'relative', zIndex: 1, color: previewCard.colors.offerText, border: '1px solid ' + previewCard.colors.accent }}>🎁 {previewCard.specialOffer}</div>}
                            <div style={{ marginTop: '9px', padding: '7px 8px', textAlign: 'center', position: 'relative', zIndex: 1, background: previewCard.colors.panelAlt, color: previewCard.colors.infoText, border: '1px solid ' + previewCard.colors.accent, borderRadius: '8px', fontSize: '10px', lineHeight: 1.7, fontWeight: 600 }}>احتفظ بهذا الكرت بعد التسجيل لاستكمال المدة والاستفادة من الباقة كاملة</div>
            </div>
          </div>
        </div>

        {printRetryAvailable && printedCards.length > 0 && (
          <div role="status" style={{ marginBottom: '18px', padding: '18px', borderRadius: '16px', background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.55)', color: '#e2e8f0' }}>
            <div style={{ fontWeight: 800, marginBottom: '8px', color: '#6ee7b7' }}>تم حفظ الدفعة — الطباعة لم تكتمل</div>
            <p style={{ fontSize: '14px', lineHeight: 1.8, marginBottom: '12px' }}>أعد تجهيز صفحة الطباعة للدفعة نفسها. لن يُرسل طلب حفظ جديد ولن يُخصم الرصيد مرة أخرى.</p>
            <button
              onClick={async () => {
                const prepared = await exportSamplePDF(printedCards, true)
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
        <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '25px', border: '2px solid rgba(124,58,237,0.30)', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
          <h2 style={{ color: '#FFD700', marginBottom: '20px', fontSize: '22px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '28px' }}>⚙️</span> إعدادات الكرت
          </h2>

          <InputRow label="البروفايل" icon="👤" fieldId="profile">
            <select value={formData.profile} onChange={(e) => { setFormData({...formData, profile: e.target.value}); setActiveField('profile') }} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }}>
              <option value="DEFAULT">DEFAULT</option>
              <option value="PREMIUM">PREMIUM</option>
              <option value="BASIC">BASIC</option>
            </select>
          </InputRow>

          <InputRow label="الصلاحية" icon="✓" fieldId="validity">
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <input type="number" value={formData.validity} onChange={(e) => { setFormData({...formData, validity: e.target.value}); setActiveField('validity') }} min="1" style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
              <select value={formData.validityType} onChange={(e) => { setFormData({...formData, validityType: e.target.value}); setActiveField('validity') }} style={{ flex: 2, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                <option value="no-expiry">بدون مدة</option>
                <option value="hour">ساعة</option>
                <option value="day">يوم</option>
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
              </select>
            </div>
          </InputRow>

          <InputRow label="مدة المستخدم" icon="⏱️" fieldId="userDuration">
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <input type="number" value={formData.userDuration} onChange={(e) => { setFormData({...formData, userDuration: e.target.value}); setActiveField('userDuration') }} min="1" style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
              <select value={formData.userDurationType} onChange={(e) => { setFormData({...formData, userDurationType: e.target.value}); setActiveField('userDuration') }} style={{ flex: 2, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                <option value="no-expiry">بدون مدة</option>
                <option value="hour">ساعة</option>
                <option value="day">يوم</option>
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
              </select>
            </div>
          </InputRow>

          <InputRow label="باقة البيانات" icon="💾" fieldId="dataPackage">
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <select value={formData.dataPackage} onChange={(e) => { setFormData({...formData, dataPackage: e.target.value}); setActiveField('dataPackage') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                <option value="unlimited">بدون حد</option>
                <option value="limited">محدد</option>
              </select>
              {formData.dataPackage === 'limited' && (
                <>
                  <input type="number" value={formData.dataAmount} onChange={(e) => { setFormData({...formData, dataAmount: e.target.value}); setActiveField('dataPackage') }} min="1" style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
                  <select value={formData.dataUnit} onChange={(e) => { setFormData({...formData, dataUnit: e.target.value}); setActiveField('dataPackage') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                    <option value="MB">MB</option>
                    <option value="GB">GB</option>
                  </select>
                </>
              )}
            </div>
          </InputRow>

          <InputRow label="اسم الشبكة" icon="🌐" fieldId="network">
            <input type="text" value={formData.networkName} onChange={(e) => { setFormData({...formData, networkName: e.target.value}); setActiveField('network') }} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow label="وقت الكرت" icon="" fieldId="cardTime">
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <input type="number" value={formData.cardTime} onChange={(e) => { setFormData({...formData, cardTime: e.target.value}); setActiveField('cardTime') }} min="1" style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }} />
              <select value={formData.cardTimeType} onChange={(e) => { setFormData({...formData, cardTimeType: e.target.value}); setActiveField('cardTime') }} style={{ flex: 2, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
                <option value="hour">ساعة</option>
                <option value="day">يوم</option>
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
              </select>
            </div>
          </InputRow>

          <InputRow label="سعر الكرت" icon="💰" fieldId="price">
            <input type="number" value={formData.cardPrice} onChange={(e) => { setFormData({...formData, cardPrice: e.target.value}); setActiveField('price') }} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(183,243,74,0.65)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow label="الموزع" icon="" fieldId="distributor">
            <input type="text" value={formData.distributor} onChange={(e) => { setFormData({...formData, distributor: e.target.value}); setActiveField('distributor') }} placeholder="عبدالرحمن" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow label="بداية اسم المستخدم" icon="🔢" fieldId="prefix">
            <input type="text" value={formData.usernamePrefix} onChange={(e) => { setFormData({...formData, usernamePrefix: e.target.value.replace(/[^0-9]/g, '')}); setActiveField('prefix') }} placeholder="86" maxLength={5} style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow label={`عدد الأرقام: ${formData.usernameLength}`} icon="" fieldId="length">
            <input type="range" min="6" max="20" value={formData.usernameLength} onChange={(e) => { setFormData({...formData, usernameLength: parseInt(e.target.value)}); setActiveField('length') }} style={{ flex: 1 }} />
          </InputRow>

          <InputRow label="لون اسم المستخدم" icon="🎨" fieldId="usernameColor">
            <input type="color" value={formData.usernameColor} onChange={(e) => { setFormData({...formData, usernameColor: e.target.value}); setActiveField('usernameColor') }} style={{ flex: 1, height: '45px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
          </InputRow>

          <InputRow label="عدد الكروت" icon="📦" fieldId="count">
            <input type="number" value={formData.cardsCount} onChange={(e) => { setFormData({...formData, cardsCount: parseInt(e.target.value) || 100}); setActiveField('count') }} min="1" max="10000" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow label="عدد الأعمدة" icon="" fieldId="cols">
            <input type="number" value={formData.colsCount} onChange={(e) => { setFormData({...formData, colsCount: parseInt(e.target.value) || 3}); setActiveField('cols') }} min="1" max="10" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          {/* تصميم الكرت */}
          <h3 style={{ color: '#FFD700', margin: '25px 0 15px 0', fontSize: '18px', fontWeight: 'bold', borderBottom: '2px solid rgba(124,58,237,0.45)', paddingBottom: '10px' }}>🎨 تصميم الكرت</h3>

          <InputRow label="نوع التصميم" icon="🎭" fieldId="cardStyle">
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <button onClick={() => { setFormData({...formData, cardStyle: 'plain'}); setActiveField('cardStyle') }} style={{ flex: 1, padding: '12px', background: formData.cardStyle === 'plain' ? 'linear-gradient(135deg, #FFD700, #7c3aed)' : 'rgba(0,0,0,0.5)', color: formData.cardStyle === 'plain' ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>عادي</button>
              <button onClick={() => { setFormData({...formData, cardStyle: 'colored'}); setActiveField('cardStyle') }} style={{ flex: 1, padding: '12px', background: formData.cardStyle === 'colored' ? 'linear-gradient(135deg, #FFD700, #7c3aed)' : 'rgba(0,0,0,0.5)', color: formData.cardStyle === 'colored' ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>ملون</button>
              <button onClick={() => { setFormData({...formData, cardStyle: 'three-color'}); setActiveField('cardStyle') }} style={{ flex: 1, padding: '12px', background: formData.cardStyle === 'three-color' ? 'linear-gradient(135deg, #2563eb, #a855f7)' : 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>ثلاثي الألوان</button>
            </div>
          </InputRow>

          {formData.cardStyle === 'colored' && (
            <InputRow label="نظام الألوان" icon="🌈" fieldId="colorScheme">
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

          <InputRow label="التأثير" icon="✨" fieldId="cardEffect">
            <select value={formData.cardEffect} onChange={(e) => { setFormData({...formData, cardEffect: e.target.value}); setActiveField('cardEffect') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
              <option value="plain">عادي</option>
              <option value="gradient">مدرج</option>
              <option value="3d">3D</option>
              <option value="shadow">مظل</option>
              <option value="glow">موهج</option>
            </select>
          </InputRow>

          <InputRow label="شكل الكرت" icon="📱" fieldId="cardShape">
            <div style={{ display: 'flex', gap: '8px', flex: 1 }}>
              <button onClick={() => { setFormData({...formData, cardShape: 'rectangle'}); setActiveField('cardShape') }} style={{ flex: 1, padding: '10px', background: formData.cardShape === 'rectangle' ? 'linear-gradient(135deg, #FFD700, #7c3aed)' : 'rgba(0,0,0,0.5)', color: formData.cardShape === 'rectangle' ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مستطيل</button>
              <button onClick={() => { setFormData({...formData, cardShape: 'square'}); setActiveField('cardShape') }} style={{ flex: 1, padding: '10px', background: formData.cardShape === 'square' ? 'linear-gradient(135deg, #FFD700, #7c3aed)' : 'rgba(0,0,0,0.5)', color: formData.cardShape === 'square' ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مربع</button>
              <button onClick={() => { setFormData({...formData, cardShape: 'rounded'}); setActiveField('cardShape') }} style={{ flex: 1, padding: '10px', background: formData.cardShape === 'rounded' ? 'linear-gradient(135deg, #FFD700, #7c3aed)' : 'rgba(0,0,0,0.5)', color: formData.cardShape === 'rounded' ? '#0f172a' : '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>مدور</button>
            </div>
          </InputRow>

          <InputRow label="نوع الإطار" icon="框" fieldId="borderStyle">
            <select value={formData.borderStyle} onChange={(e) => { setFormData({...formData, borderStyle: e.target.value}); setActiveField('borderStyle') }} style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '8px', color: '#fff', fontSize: '14px', textAlign: 'center' }}>
              <option value="solid">متصل ━</option>
              <option value="dashed">متقطع ┄</option>
              <option value="dotted">منقط ┈</option>
            </select>
          </InputRow>

          <InputRow label={`سمك الإطار: ${formData.borderWidth}px`} icon="" fieldId="borderWidth">
            <input type="range" min="1" max="8" value={formData.borderWidth} onChange={(e) => { setFormData({...formData, borderWidth: parseInt(e.target.value)}); setActiveField('borderWidth') }} style={{ flex: 1 }} />
          </InputRow>

          <InputRow label="QR Code" icon="📱" fieldId="qr">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
              <input type="checkbox" checked={formData.enableQR} onChange={(e) => { setFormData({...formData, enableQR: e.target.checked}); setActiveField('qr') }} style={{ width: '22px', height: '22px', cursor: 'pointer' }} />
              <span style={{ color: '#e2e8f0', fontSize: '14px' }}>تفعيل</span>
            </div>
          </InputRow>

          {formData.enableQR && (
            <InputRow label={`حجم QR: ${formData.qrSize}px`} icon="📐" fieldId="qrSize">
              <input type="range" min="40" max="80" value={formData.qrSize} onChange={(e) => { setFormData({...formData, qrSize: parseInt(e.target.value)}); setActiveField('qrSize') }} style={{ flex: 1 }} />
            </InputRow>
          )}

          <InputRow label="نص الشحن" icon="⚡" fieldId="recharge">
            <input type="text" value={formData.rechargeText} onChange={(e) => { setFormData({...formData, rechargeText: e.target.value}); setActiveField('recharge') }} placeholder="بنكك، تحويل، يوجد شحن..." style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '15px', textAlign: 'center' }} />
          </InputRow>

          <InputRow label="عرض خاص" icon="" fieldId="special">
            <textarea value={formData.specialOffer} onChange={(e) => { setFormData({...formData, specialOffer: e.target.value}); setActiveField('special') }} rows={2} placeholder="للتواصل: 0123456789" style={{ flex: 1, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '2px solid rgba(124,58,237,0.45)', borderRadius: '10px', color: '#fff', fontSize: '14px', resize: 'vertical', textAlign: 'center' }} />
          </InputRow>

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

        {/* نافذة تأكيد الكمية */}
        {showConfirm && printedCards.length > 0 && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 1000 }}>
            <div style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', borderRadius: '25px', padding: '30px', maxWidth: '500px', width: '100%', border: '2px solid rgba(124,58,237,0.45)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
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
