export default function TestPage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center', color: '#00ffff', background: '#0f172a', minHeight: '100vh' }}>
      <h1>✅ الصفحة الجديدة شغالة!</h1>
      <p>التاريخ: {new Date().toLocaleString('ar')}</p>
    </div>
  )
}
