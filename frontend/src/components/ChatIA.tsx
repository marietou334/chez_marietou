import { useState, useRef, useEffect } from 'react'
import axios from 'axios'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatIA() {
  const [ouvert, setOuvert] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Bonjour ! 👋 Je suis Jeanne, votre assistante chez Mariétou. Comment puis-je vous aider ?' }
  ])
  const [input, setInput] = useState('')
  const [chargement, setChargement] = useState(false)
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages])

  const envoyer = async () => {
    if (!input.trim() || chargement) return
    const question = input
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: question }])
    setChargement(true)
    try {
      const historique = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await axios.post('http://localhost:8000/ia/client', { message: question, historique })
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reponse }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Désolée ! Contactez-nous sur WhatsApp 📱' }])
    }
    setChargement(false)
  }

  return (
    <>
      {/* Bulle notification */}
      {!ouvert && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '24px',
          background: 'white', borderRadius: '16px 16px 4px 16px',
          padding: '10px 16px', fontSize: '13px', fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          zIndex: 9998, color: 'var(--sombre)',
          border: '1px solid rgba(212,175,55,0.2)',
          animation: 'glisser-haut 0.5s ease',
          cursor: 'pointer',
        }} onClick={() => setOuvert(true)}>
          💬 Besoin d'aide ?
        </div>
      )}

      {/* Bouton flottant */}
      <button onClick={() => setOuvert(!ouvert)} style={{
        position: 'fixed', bottom: '24px', right: '24px',
        width: '60px', height: '60px', borderRadius: '50%',
        background: ouvert
          ? 'linear-gradient(135deg, #C45C26, #E07030)'
          : 'linear-gradient(135deg, #2D6A4F, #40916C)',
        border: 'none', cursor: 'pointer', fontSize: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
        zIndex: 9999, transition: 'all 0.3s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white',
      }}>
        {ouvert ? '✕' : '💬'}
      </button>

      {/* Fenêtre chat */}
      {ouvert && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '24px',
          width: '340px', height: '500px',
          background: 'white', borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          zIndex: 9998, display: 'flex', flexDirection: 'column',
          overflow: 'hidden', animation: 'glisser-haut 0.3s ease',
          border: '1px solid rgba(0,0,0,0.06)',
        }}>

          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, #1A3A2A, #2D6A4F)',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}>
            {/* Avatar Jeanne */}
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '22px', flexShrink: 0,
              border: '2px solid rgba(255,255,255,0.3)',
            }}>👩🏾</div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '15px', marginBottom: '2px' }}>
                Jeanne
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '7px', height: '7px', borderRadius: '50%',
                  background: '#4ADE80',
                }} />
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>
                  Assistante • En ligne
                </span>
              </div>
            </div>
            <button onClick={() => setOuvert(false)} style={{
              background: 'rgba(255,255,255,0.1)', border: 'none',
              color: 'white', width: '28px', height: '28px',
              borderRadius: '50%', cursor: 'pointer', fontSize: '14px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>

          {/* Messages */}
          <div ref={messagesRef} style={{
            flex: 1, overflowY: 'auto', padding: '16px',
            display: 'flex', flexDirection: 'column', gap: '10px',
            background: '#F8F6F3',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end', gap: '8px',
              }}>
                {msg.role === 'assistant' && (
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '14px', flexShrink: 0,
                  }}>👩🏾</div>
                )}
                <div style={{
                  maxWidth: '75%',
                  padding: '10px 14px',
                  borderRadius: msg.role === 'user'
                    ? '18px 4px 18px 18px'
                    : '4px 18px 18px 18px',
                  background: msg.role === 'user'
                    ? 'linear-gradient(135deg, #C45C26, #E07030)'
                    : 'white',
                  color: msg.role === 'user' ? 'white' : '#1A0A00',
                  fontSize: '13px', lineHeight: 1.6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {chargement && (
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px',
                }}>👩🏾</div>
                <div style={{
                  padding: '12px 16px', background: 'white',
                  borderRadius: '4px 18px 18px 18px',
                  display: 'flex', gap: '5px', alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '7px', height: '7px', borderRadius: '50%',
                      background: 'var(--or)',
                      animation: `brillant 1.2s ease ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Suggestions rapides */}
          {messages.length === 1 && (
            <div style={{
              padding: '8px 12px',
              background: '#F8F6F3',
              display: 'flex', gap: '6px',
              overflowX: 'auto', scrollbarWidth: 'none',
            }}>
              {['Livraison ?', 'Paiement ?', 'Retour ?', 'Promo ?'].map(s => (
                <button key={s} onClick={() => {
                  setInput(s)
                }} style={{
                  padding: '6px 12px', borderRadius: '50px',
                  border: '1px solid rgba(212,175,55,0.3)',
                  background: 'white', cursor: 'pointer',
                  fontSize: '12px', whiteSpace: 'nowrap',
                  color: 'var(--terracotta)', fontWeight: 500,
                  transition: 'all 0.2s',
                }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', gap: '8px', background: 'white',
            alignItems: 'center',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && envoyer()}
              placeholder="Votre message..."
              style={{
                flex: 1, padding: '10px 16px',
                borderRadius: '50px',
                border: '1.5px solid rgba(212,175,55,0.25)',
                outline: 'none', fontSize: '13px',
                background: '#F8F6F3',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--or)'}
              onBlur={e => e.target.style.borderColor = 'rgba(212,175,55,0.25)'}
            />
            <button onClick={envoyer} disabled={chargement} style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: input.trim()
                ? 'linear-gradient(135deg, #C45C26, #E07030)'
                : '#E0E0E0',
              border: 'none', cursor: input.trim() ? 'pointer' : 'default',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', transition: 'all 0.2s', flexShrink: 0,
              color: 'white',
            }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  )
}
