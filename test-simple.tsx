export default function TestSimple() {
  return (
    <div style={{ 
      padding: '20px', 
      color: 'white', 
      backgroundColor: '#0a0a0a',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ color: '#00ffff', fontSize: '3rem', marginBottom: '20px' }}>
        🧠 DecentraMind Test Page
      </h1>
      <p style={{ fontSize: '1.2rem', textAlign: 'center', maxWidth: '600px' }}>
        This is a simple test page to verify that Next.js is working correctly.
        If you can see this page, the basic setup is working.
      </p>
      <div style={{ 
        marginTop: '40px',
        padding: '20px',
        border: '2px solid #00ffff',
        borderRadius: '10px',
        backgroundColor: 'rgba(0, 255, 255, 0.1)'
      }}>
        <h2 style={{ color: '#00ffff', marginBottom: '10px' }}>Status Check</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '5px 0', color: '#2ed573' }}>✅ Next.js is running</li>
          <li style={{ margin: '5px 0', color: '#2ed573' }}>✅ React is working</li>
          <li style={{ margin: '5px 0', color: '#2ed573' }}>✅ Basic styling is applied</li>
          <li style={{ margin: '5px 0', color: '#ffa726' }}>⚠️ Main page needs investigation</li>
        </ul>
      </div>
    </div>
  );
} 