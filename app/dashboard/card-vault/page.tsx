'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import BrandLogo from '@/components/BrandLogo'
import AuthThemeToggle from '@/components/AuthThemeToggle'

type VaultCard = {
  id: string
  card_code: string
  card_value: string
  duration: string
  printed_at: string
  batch_id: string | null
}

type Pagination = {
  page: number
  page_size: number
  total: number
  total_pages: number
}

const numberFormat = new Intl.NumberFormat('ar')

export default function CardVaultPage() {
  const router = useRouter()
  const [cards, setCards] = useState<VaultCard[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    page_size: 30,
    total: 0,
    total_pages: 1,
  })
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCards() {
      setLoading(true)
      setError('')

      try {
        const params = new URLSearchParams({ page: String(page) })
        if (search) params.set('q', search)

        const response = await fetch(`/api/card-vault?${params.toString()}`, {
          method: 'GET',
          cache: 'no-store',
          credentials: 'same-origin',
          signal: controller.signal,
        })
        const result = await response.json().catch(() => null)

        if (response.status === 401) {
          router.replace('/login')
          return
        }
        if (!response.ok || result?.success !== true) {
          throw new Error(result?.message || 'تعذر تحميل محفوظات الكروت.')
        }

        setCards(Array.isArray(result.cards) ? result.cards : [])
        setPagination(result.pagination)
      } catch (loadError) {
        if (loadError instanceof Error && loadError.name === 'AbortError') return
        setError(loadError instanceof Error ? loadError.message : 'حدث خطأ غير متوقع.')
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void loadCards()
    return () => controller.abort()
  }, [page, search, refreshKey, router])

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setPage(1)
    setSearch(searchInput.replace(/[^0-9]/g, '').slice(0, 32))
  }

  const copyCardCode = async (card: VaultCard) => {
    try {
      await navigator.clipboard.writeText(card.card_code)
      setCopiedId(card.id)
    } catch {
      setError('تعذر النسخ تلقائياً. اضغط مطولاً على رقم الكرت لنسخه.')
    }
  }

  return (
    <main className="vault-shell" dir="rtl">
      <div className="vault-container">
        <header className="vault-header">
          <div className="vault-brand">
            <BrandLogo compact />
            <div>
              <span className="vault-eyebrow">JASSAS NET CARD</span>
              <h1>خزنة الكروت</h1>
              <p>محفوظات الكروت التي تم إنشاؤها وحفظها في حسابك</p>
            </div>
          </div>
          <div className="vault-header-actions">
            <AuthThemeToggle />
            <button type="button" className="vault-back" onClick={() => router.push('/dashboard')}>
              <span aria-hidden="true">→</span> لوحة التحكم
            </button>
          </div>
        </header>

        <section className="vault-summary" aria-label="ملخص الخزنة">
          <div>
            <span>إجمالي الكروت المحفوظة</span>
            <strong>{numberFormat.format(pagination.total)}</strong>
          </div>
          <span className="vault-summary-mark" aria-hidden="true">▤</span>
        </section>

        <section className="vault-panel" aria-labelledby="vault-list-title">
          <div className="vault-panel-heading">
            <div>
              <span className="vault-kicker">إدارة محفوظاتك</span>
              <h2 id="vault-list-title">الكروت المحفوظة</h2>
            </div>
            <button type="button" className="vault-refresh" onClick={() => {
              setRefreshKey((current) => current + 1)
            }} disabled={loading}>
              {loading ? 'جارٍ التحديث...' : 'تحديث القائمة'}
            </button>
          </div>

          <form className="vault-search" onSubmit={handleSearch}>
            <label htmlFor="vault-card-search">ابحث برقم الكرت</label>
            <div>
              <input
                id="vault-card-search"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value.replace(/[^0-9]/g, '').slice(0, 32))}
                placeholder="أدخل رقم الكرت..."
                autoComplete="off"
              />
              <button type="submit">بحث</button>
              {search && <button type="button" className="vault-clear" onClick={() => { setSearchInput(''); setSearch(''); setPage(1) }}>مسح</button>}
            </div>
          </form>

          {error && <p className="vault-error" role="alert">{error}</p>}
          {loading && cards.length === 0 ? (
            <div className="vault-state" role="status"><span className="vault-spinner" /> جارٍ تحميل الكروت...</div>
          ) : !loading && cards.length === 0 ? (
            <div className="vault-state vault-empty">
              <span aria-hidden="true">▤</span>
              <strong>{search ? 'لا توجد نتائج مطابقة' : 'الخزنة فارغة حالياً'}</strong>
              <p>{search ? 'جرّب رقم كرت آخر.' : 'عند إنشاء دفعات الكروت وحفظها ستظهر هنا تلقائياً.'}</p>
              {!search && <button type="button" onClick={() => router.push('/dashboard/print-cards')}>الانتقال إلى استوديو الكروت</button>}
            </div>
          ) : (
            <div className="vault-card-list">
              {cards.map((card) => (
                <article className="vault-card-item" key={card.id}>
                  <div className="vault-card-number">
                    <span>رقم الكرت / اسم المستخدم</span>
                    <strong dir="ltr">{card.card_code}</strong>
                  </div>
                  <div className="vault-card-details">
                    <div><span>القيمة</span><strong>{card.card_value}</strong></div>
                    <div><span>الصلاحية</span><strong>{card.duration}</strong></div>
                    <div><span>تاريخ الحفظ</span><strong>{card.printed_at ? new Date(card.printed_at).toLocaleString('ar') : 'غير متاح'}</strong></div>
                  </div>
                  <button type="button" className="vault-copy" onClick={() => void copyCardCode(card)}>
                    {copiedId === card.id ? 'تم النسخ ✓' : 'نسخ الرقم'}
                  </button>
                </article>
              ))}
            </div>
          )}

          <div className="vault-pagination">
            <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={loading || page <= 1}>السابق</button>
            <span>صفحة {numberFormat.format(pagination.page)} من {numberFormat.format(pagination.total_pages)}</span>
            <button type="button" onClick={() => setPage((current) => Math.min(pagination.total_pages, current + 1))} disabled={loading || page >= pagination.total_pages}>التالي</button>
          </div>
        </section>

        <footer className="vault-footer">جساس نت كرت · JASSAS SOFT PRO</footer>
      </div>
    </main>
  )
}
