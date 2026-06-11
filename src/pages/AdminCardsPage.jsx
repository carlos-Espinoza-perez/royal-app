import { useState, useRef } from 'react'
import { Download, Upload, CheckCircle2, Circle } from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import AdminShell from '../layouts/AdminShell.jsx'
import RoyalFrame from '../components/RoyalFrame.jsx'
import CarnetPreview from '../components/CarnetPreview.jsx'
import { alumnos as initialAlumnos } from '../data/mockData.js'

export default function AdminCardsPage() {
  const [baseImage, setBaseImage] = useState('/carnet-bg.jpg')
  const [selectedAlumnos, setSelectedAlumnos] = useState(
    initialAlumnos.reduce((acc, a) => ({ ...acc, [a.id]: a.activo }), {})
  )
  const [isGenerating, setIsGenerating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [modalIdx, setModalIdx] = useState(0)
  const previewContainerRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => setBaseImage(event.target.result)
      reader.readAsDataURL(file)
    }
  }

  const toggleAlumno = (id) => {
    setSelectedAlumnos(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const toggleAll = () => {
    const allSelected = initialAlumnos.every(a => selectedAlumnos[a.id])
    const newState = initialAlumnos.reduce((acc, a) => ({ ...acc, [a.id]: !allSelected }), {})
    setSelectedAlumnos(newState)
  }

  const generatePDF = async () => {
    // We no longer require the user to manually upload an image.
    // If they did not upload one, it will use /carnet-bg.jpg by default.
    
    const alumnosToGenerate = initialAlumnos.filter(a => selectedAlumnos[a.id])
    if (alumnosToGenerate.length === 0) return alert("Selecciona al menos un alumno.")

    setIsGenerating(true)

    try {
      // PDF initialization (A4 size, portrait)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      
      // Tarjeta de Identificación CR80 (Horizontal)
      const cardWidthMM = 85
      const cardHeightMM = 55
      
      const margin = 5   // mm de margen exterior
      const spacing = 3  // mm de espacio entre carnets
      // Con esto: 2 col × 5 filas = 10 carnets por hoja A4
      
      // Calculate how many fit per row/col
      const cols = Math.floor((pdfWidth - margin * 2 + spacing) / (cardWidthMM + spacing))
      const rows = Math.floor((pdfHeight - margin * 2 + spacing) / (cardHeightMM + spacing))
      const cardsPerPage = cols * rows

      const container = previewContainerRef.current
      if (!container) throw new Error("Preview container not found")

      // Find all carnet nodes
      const carnetNodes = Array.from(container.querySelectorAll('.carnet-export-container'))

      let pageIdx = 0
      for (let i = 0; i < carnetNodes.length; i++) {
        const node = carnetNodes[i]
        
        // Ensure images are loaded before canvas generation
        const canvas = await html2canvas(node, {
          scale: 2, // High resolution
          useCORS: true,
          logging: false,
          backgroundColor: null,
        })
        
        const imgData = canvas.toDataURL('image/png')
        
        const positionOnPage = i % cardsPerPage
        
        if (i > 0 && positionOnPage === 0) {
          pdf.addPage()
          pageIdx++
        }
        
        const col = positionOnPage % cols
        const row = Math.floor(positionOnPage / cols)
        
        const x = margin + col * (cardWidthMM + spacing)
        const y = margin + row * (cardHeightMM + spacing)
        
        pdf.addImage(imgData, 'PNG', x, y, cardWidthMM, cardHeightMM)
      }
      
      pdf.save('Carnets_RoyalTreasury.pdf')
    } catch (error) {
      console.error("Error generating PDF:", error)
      alert("Hubo un error al generar el PDF.")
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedCount = Object.values(selectedAlumnos).filter(Boolean).length
  const selectedList = initialAlumnos.filter(a => selectedAlumnos[a.id])

  const openModal = () => { setModalIdx(0); setShowModal(true) }
  const closeModal = () => setShowModal(false)
  const prevCard = () => setModalIdx(i => Math.max(0, i - 1))
  const nextCard = () => setModalIdx(i => Math.min(selectedList.length - 1, i + 1))

  return (
    <AdminShell title="Generador de carnets" eyebrow="Identificación oficial">
      {/* Hidden container for PDF rendering */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', pointerEvents: 'none' }}>
        <div ref={previewContainerRef} style={{ display: 'flex', gap: '20px' }}>
          {selectedList.map(alumno => (
            <CarnetPreview key={alumno.id} alumno={alumno} baseImage={baseImage} />
          ))}
        </div>
      </div>

      {/* Modal de preview 1 a 1 */}
      {showModal && selectedList.length > 0 && (
        <div onClick={closeModal} style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.75)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem',
          backdropFilter: 'blur(4px)'
        }}>
          <div onClick={e => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '0 1rem', width: '100%', maxWidth: '900px', boxSizing: 'border-box' }}>
            {/* Card preview — clipped to visible scaled height */}
            <div style={{ 
              width: '100%',
              overflow: 'hidden',
              height: '231px', /* 550px * scale(0.42) */
              display: 'flex',
              justifyContent: 'center'
            }}>
              <div style={{ 
                transform: 'scale(0.42)', 
                transformOrigin: 'top center',
                width: '850px',
                flexShrink: 0
              }}>
                <CarnetPreview alumno={selectedList[modalIdx]} baseImage={baseImage} />
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <button
                onClick={prevCard}
                disabled={modalIdx === 0}
                style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem', cursor: 'pointer', opacity: modalIdx === 0 ? 0.3 : 1 }}
              >←</button>
              <span style={{ color: 'white', fontFamily: "'Cinzel', serif", fontWeight: 600 }}>
                {modalIdx + 1} / {selectedList.length}
              </span>
              <button
                onClick={nextCard}
                disabled={modalIdx === selectedList.length - 1}
                style={{ background: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', fontSize: '1.2rem', cursor: 'pointer', opacity: modalIdx === selectedList.length - 1 ? 0.3 : 1 }}
              >→</button>
            </div>

            {/* Close */}
            <button
              onClick={closeModal}
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '0.5rem 1.5rem', cursor: 'pointer', fontFamily: "'Cinzel', serif" }}
            >Cerrar</button>
          </div>
        </div>
      )}

      <div className="cards-page-layout">

        {/* Selección: panel principal */}
        <RoyalFrame className="admin-panel cards-workspace">
          <div className="section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Selección de miembros</h2>
            <button onClick={toggleAll} style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--primary-700)', cursor: 'pointer', fontWeight: 'bold' }}>
              Invertir selección
            </button>
          </div>

          <div className="checkbox-list" style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {initialAlumnos.map((alumno) => (
              <label
                key={alumno.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  background: selectedAlumnos[alumno.id] ? 'var(--primary-50)' : 'transparent',
                  transition: 'background 0.2s'
                }}
                onClick={(e) => { e.preventDefault(); toggleAlumno(alumno.id); }}
              >
                {selectedAlumnos[alumno.id] ? (
                  <CheckCircle2 size={20} color="var(--primary-700)" />
                ) : (
                  <Circle size={20} color="var(--line)" />
                )}
                <div style={{ display: 'grid' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text)' }}>{alumno.nombre}</span>
                  <small style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>{alumno.numero}</small>
                </div>
              </label>
            ))}
          </div>

          {/* Acciones */}
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--primary-50)', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--primary-900)', fontWeight: 600 }}>
                {selectedCount} miembro{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
              </span>
            </div>

            <button
              className="royal-button"
              onClick={openModal}
              disabled={selectedCount === 0}
              style={{ opacity: selectedCount === 0 ? 0.4 : 1, width: '100%', justifyContent: 'center' }}
            >
              👁 Ver carnets
            </button>

            <button
              className="royal-button royal-button--gold"
              onClick={generatePDF}
              disabled={selectedCount === 0 || isGenerating}
              style={{ opacity: (selectedCount === 0 || isGenerating) ? 0.4 : 1, width: '100%', justifyContent: 'center' }}
            >
              {isGenerating ? <Circle size={16} className="lucide-spin" /> : <Download size={16} />}
              {isGenerating ? 'Generando...' : 'Descargar PDF'}
            </button>
          </div>
        </RoyalFrame>

      </div>
    </AdminShell>
  )
}
