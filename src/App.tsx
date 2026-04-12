import React, { useState, useMemo } from 'react';
import { 
  Settings, Layout, PlayCircle, ChevronLeft, ChevronRight, 
  Download, Printer, Info, StickyNote, Check, X, Layers, Star,
  Briefcase as PortfolioIcon, MessageSquare, Eye, Clipboard, Building, Monitor, HelpCircle
} from 'lucide-react';
import { categories, cardsData, processSteps } from './data';
import { CircleIcon, TransversalIcons } from './components/Icons';

// --- FUNZIONE RENDER ICONE TRASVERSALI ---
const renderTransversals = (transversals) => {
  if (!transversals || transversals.length === 0) return null;
  return (
    <div className="flex gap-2 text-cyan-500">
      {transversals.map((t, index) => {
        const Icon = TransversalIcons[t];
        return Icon ? <Icon key={index} size={18} /> : null;
      })}
    </div>
  );
};

// --- COMPONENTE CARTA ---
interface CardProps {
  card: any;
  categoryId: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onOpenDetails: ((card: any, category: any) => void) | null;
  note: string;
  onNoteChange?: (id: string, value: string) => void;
  isPortfolioView?: boolean;
  isDeckView?: boolean;
}

const Card: React.FC<CardProps> = ({ card, categoryId, isSelected, onToggle, onOpenDetails, note, onNoteChange, isPortfolioView, isDeckView }) => {
  const category = categories.find(c => c.id === categoryId) || categories[0];
  const IconComponent = card.icon || Info;

  return (
    <div className={`relative flex flex-col h-full bg-white border-2 shadow-xl transition-all hover:shadow-2xl opacity-100 ${isSelected ? `${category.border} ring-4 ring-indigo-500/20` : 'border-zinc-200'} print:shadow-none print:border-zinc-300 print:rounded-lg`}>
      
      {/* Controlli di selezione */}
      <div className="absolute top-2 right-2 z-20 flex gap-2 no-print">
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(card.code || card.id); }}
          className={`p-1.5 rounded-full shadow-md border-2 transition-colors ${isSelected ? `bg-indigo-600 border-indigo-600 text-white` : 'bg-white border-zinc-300 text-zinc-300 hover:text-indigo-400'}`}
          title="Aggiungi/Rimuovi dal Portfolio"
        >
          <Check size={18} strokeWidth={3} />
        </button>
      </div>

      {/* Intestazione della Carta: Titolo e Codice */}
      <div className="p-5 pr-14 flex justify-between items-start min-h-[90px] border-b border-zinc-50 cursor-pointer print:p-2 print:min-h-0 print:pr-2" onClick={() => onOpenDetails && onOpenDetails(card, category)}>
        <h2 className={`text-xl font-black italic uppercase leading-tight tracking-tighter ${category.text} max-w-[85%] print:text-[10px] print:italic-none`}>
          {card.title}
        </h2>
        <span className={`text-sm font-black ${category.text} print:text-[8px]`}>
          {card.code || card.id}
        </span>
      </div>

      {/* Illustrazione Centrale */}
      <div 
        className={`h-56 flex items-center justify-center bg-gradient-to-br ${category.gradient} m-1 rounded-sm shadow-inner cursor-pointer print:bg-none print:bg-zinc-50 print:h-28 print:m-0.5`}
        onClick={() => onOpenDetails && onOpenDetails(card, category)}
      >
        <IconComponent size={140} strokeWidth={1.5} className="text-white opacity-95 drop-shadow-2xl print:hidden" />
        <IconComponent size={70} strokeWidth={1.5} color={category.hex} className="hidden print:block opacity-90" />
      </div>

      {/* Riferimenti "Good With" e Simboli Trasversali Mappati */}
      <div className="px-5 py-4 flex flex-col border-b border-zinc-100 min-h-[65px] cursor-pointer print:px-2 print:py-1 print:min-h-0" onClick={() => onOpenDetails && onOpenDetails(card, category)}>
        <div className="flex justify-between items-center w-full">
          <div className="flex-1">
            {card.goodWith ? (
              <>
                <div className={`text-[10px] font-black uppercase ${category.text} tracking-widest mb-1.5 leading-none print:text-[6px] print:mb-0.5`}>IN SINERGIA CON</div>
                <div className="flex flex-wrap gap-1.5 max-w-[180px] print:gap-0.5">
                  {card.goodWith.split(', ').map(c => (
                    <span key={c} className={`text-[11px] font-bold ${category.text} print:text-[7px]`}>{c}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-6 print:h-2" />
            )}
          </div>
          <div className="flex justify-end shrink-0 pl-2 print:pl-1">
            {renderTransversals(card.transversals)}
          </div>
        </div>
      </div>

      {/* Testo Descrittivo Principale */}
      <div className="px-5 py-5 flex-grow bg-white cursor-pointer print:px-2 print:py-1.5" onClick={() => onOpenDetails && onOpenDetails(card, category)}>
        <p className="text-[15px] font-medium text-slate-800 leading-snug print:text-[8px] print:leading-tight">
          {card.text}
        </p>

        {card.steps && (
          <div className="mt-4 space-y-2 border-l-4 border-zinc-100 pl-4 py-2 bg-zinc-50 rounded-r-lg print:mt-1 print:space-y-0.5 print:border-l-2 print:pl-1.5 print:py-0.5">
            {card.steps.map((s, i) => (
              <p key={i} className="text-[11px] text-zinc-600 font-bold italic leading-tight uppercase print:text-[6px]">{s}</p>
            ))}
          </div>
        )}
      </div>

      {/* Footer Colorato: Suggerimento / Attività */}
      {card.hint ? (
        <div className={`${category.color} p-5 min-h-[90px] flex items-center shadow-inner cursor-pointer no-print`} onClick={() => onOpenDetails && onOpenDetails(card, category)}>
          <p className="text-[14px] text-white font-bold leading-tight italic">
            💡 {card.hint}
          </p>
        </div>
      ) : (
        <div className="h-4 bg-zinc-50 no-print" />
      )}

      {/* Area Note Interattiva (Solo in modalità Portfolio) */}
      {isPortfolioView && onNoteChange && (
        <div className="p-5 bg-amber-50 border-t border-amber-200 no-print">
          <div className="flex items-center gap-2 mb-2 text-amber-600">
            <StickyNote size={14} />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Le mie Note</h4>
          </div>
          <textarea
            value={note || ''}
            onChange={(e) => onNoteChange(card.code || card.id, e.target.value)}
            placeholder="Aggiungi una nota a questa carta..."
            className="w-full p-3 text-sm bg-white/50 border border-amber-200 rounded-lg text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 italic min-h-[150px]"
          />
        </div>
      )}

      {/* Stampa: Area Note o Hint (Compatta per griglia 3x3) */}
      {isDeckView ? (
        <div className={`${category.color} p-2 hidden print:flex flex-col min-h-[60px] max-h-[60px] overflow-hidden`}>
          <p className="text-[9px] italic text-white font-bold leading-tight">
            💡 {card.hint || "Nessun suggerimento disponibile."}
          </p>
        </div>
      ) : (
        <div className="bg-amber-50 border-t border-amber-200 p-2 hidden print:flex flex-col min-h-[60px] max-h-[60px] overflow-hidden">
          <div className="flex items-center gap-1 mb-1 text-amber-600">
            <StickyNote size={10} />
            <h4 className="text-[8px] font-black uppercase tracking-tight">Note</h4>
          </div>
          <p className="text-[9px] italic text-slate-700 leading-tight line-clamp-3">
            {note || "Spazio note..."}
          </p>
        </div>
      )}
    </div>
  );
};

// --- MODAL DETTAGLIO CARTE CON POST-IT ---
interface DetailModalProps {
  card: any;
  category: any;
  note: string;
  onNoteChange: (id: string, value: string) => void;
  onClose: () => void;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ card, category, note, onNoteChange, onClose, isSelected, onToggle }) => {
  if (!card) return null;
  const IconComponent = card.icon || Info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm p-4 no-print">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-200">
        
        {/* Lato Sinistro: Vista estesa della Carta */}
        <div className="flex-1 overflow-y-auto custom-scrollbar border-r border-zinc-200 bg-slate-50 relative">
          <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-md text-zinc-500 hover:text-zinc-800 z-10 md:hidden">
            <X size={20} />
          </button>

          <div className={`p-8 border-b-8 ${category.border} bg-white`}>
            <div className="flex justify-between items-start mb-6">
              <h2 className={`text-3xl font-black italic uppercase leading-tight tracking-tighter ${category.text}`}>
                {card.title}
              </h2>
              <span className={`text-xl font-black ${category.text} bg-zinc-100 px-3 py-1 rounded-lg`}>
                {card.code || card.id}
              </span>
            </div>
            
            <div className={`w-full py-12 md:w-32 md:h-32 md:py-0 rounded-2xl flex items-center justify-center bg-gradient-to-br ${category.gradient} mb-6 shadow-lg`}>
              <IconComponent strokeWidth={1.5} className="w-24 h-24 md:w-20 md:h-20 text-white" />
            </div>

            <p className="text-xl font-medium text-slate-800 leading-relaxed mb-6">
              {card.text}
            </p>

            {card.steps && (
              <div className="mb-6 space-y-3 bg-zinc-100 p-6 rounded-xl">
                <h4 className="font-black text-xs uppercase tracking-widest text-zinc-500 mb-2">Procedura Operativa</h4>
                {card.steps.map((s, i) => (
                  <p key={i} className="text-sm text-zinc-700 font-bold italic leading-tight">{s}</p>
                ))}
              </div>
            )}

            {card.goodWith && (
              <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-100 mb-6">
                <div className={`text-[11px] font-black uppercase text-cyan-700 tracking-widest mb-3`}>Lavora in Sinergia Con</div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {card.goodWith.split(', ').map(c => (
                    <span key={c} className={`text-sm font-bold bg-white text-cyan-700 px-3 py-1 rounded-md shadow-sm border border-cyan-200`}>{c}</span>
                  ))}
                </div>
              </div>
            )}
            
            {card.transversals && (
              <div className="bg-zinc-50 p-6 rounded-xl border border-zinc-100 mb-6">
                <div className={`text-[11px] font-black uppercase text-zinc-500 tracking-widest mb-3`}>Competenze Trasversali Sviluppate</div>
                <div className="flex flex-wrap gap-3">
                  {card.transversals.map(t => {
                     const TrIcon = TransversalIcons[t];
                     return TrIcon ? (
                       <div key={t} className="p-3 bg-white text-cyan-600 rounded-lg shadow-sm border border-cyan-200 flex items-center justify-center">
                         <TrIcon size={24} strokeWidth={2.5} />
                       </div>
                     ) : null;
                  })}
                </div>
              </div>
            )}

            {card.hint && (
              <div className={`${category.color} p-6 rounded-xl text-white shadow-inner`}>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Suggerimento Pratico</div>
                <p className="text-lg font-bold leading-snug italic">
                  "{card.hint}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Lato Destro: Pannello di Lavoro (Post-it e Selezione) */}
        <div className="w-full md:w-80 bg-white p-6 flex flex-col md:h-full shrink-0 border-t md:border-t-0 md:border-l border-zinc-200">
          <div className="flex justify-end mb-6 hidden md:flex">
            <button onClick={onClose} className="p-2 bg-zinc-100 rounded-full text-zinc-500 hover:text-zinc-900 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-800 mb-4">Gestione Portfolio</h3>
            <button 
              onClick={() => onToggle(card.code || card.id)}
              className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-2 ${
                isSelected 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-white border-zinc-300 text-zinc-500 hover:border-indigo-400 hover:text-indigo-600'
              }`}
            >
              {isSelected ? <><Check size={20} /> Nel Portfolio</> : <><CircleIcon size={20} /> Aggiungi Carta</>}
            </button>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-3 text-amber-600">
              <StickyNote size={18} />
              <h3 className="text-sm font-black uppercase tracking-widest">Le tue Note</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-3 leading-tight">Scrivi qui le tue riflessioni che verranno salvate nel tuo portfolio finale.</p>
            <textarea
              value={note || ''}
              onChange={(e) => onNoteChange(card.code || card.id, e.target.value)}
              placeholder="Scrivi qui i tuoi appunti..."
              className="flex-1 w-full p-4 text-sm bg-amber-50 border border-amber-200 rounded-xl text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 shadow-inner italic min-h-[120px] md:min-h-[350px]"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// --- APP PRINCIPALE ---
export default function App() {
  const [activeTab, setActiveTab] = useState('instructions');
  const [isGuided, setIsGuided] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  
  // Stato del Portfolio
  const [selectedCards, setSelectedCards] = useState(new Set());
  const [cardNotes, setCardNotes] = useState({});
  const [detailCard, setDetailCard] = useState(null);
  const [userName, setUserName] = useState('');

  // Sotto-Filtri per le librerie di competenze
  const [compSubFilter, setCompSubFilter] = useState('all');

  const currentStep = processSteps[currentStepIndex];
  const currentCategory = categories.find(c => c.id === activeTab) || categories[0];

  const allCardsList = useMemo(() => {
    let flat = [];
    Object.keys(cardsData).forEach(catId => {
      flat = [...flat, ...cardsData[catId].map(c => ({...c, catId}))];
    });
    return flat;
  }, []);

  const handleToggleSelection = (id) => {
    setSelectedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleNoteChange = (id, value) => {
    setCardNotes(prev => ({ ...prev, [id]: value }));
  };

  const handleOpenDetails = (card, category) => {
    setDetailCard({ card, category });
  };

  const handlePortfolioClick = () => {
    setIsGuided(false);
    setActiveTab('portfolio');
  };

  // --- 1. FUNZIONE DOWNLOAD MARKDOWN ---
  const handleDownloadMarkdown = () => {
    const selected = allCardsList.filter(c => selectedCards.has(c.code || c.id));
    if (selected.length === 0) return;

    let content = userName 
      ? `# PORTFOLIO DELLE COMPETENZE DI ${userName.toUpperCase()}\n\nRiepilogo del progetto didattico generato.\n\n---\n\n`
      : `# IL MIO PORTFOLIO SCAFFOLD\n\nRiepilogo del progetto didattico generato.\n\n---\n\n`;

    const grouped = selected.reduce((acc, card) => {
      const cat = categories.find(c => c.id === card.catId);
      const catTitle = cat ? cat.title : 'Altre';
      if (!acc[catTitle]) acc[catTitle] = [];
      acc[catTitle].push(card);
      return acc;
    }, {});

    for (const [catTitle, cards] of Object.entries(grouped) as [string, any[]][]) {
      content += `## CATEGORIA: ${catTitle.toUpperCase()}\n\n`;
      cards.forEach(card => {
        content += `### ${card.title} (${card.code || card.id})\n`;
        content += `${card.text}\n\n`;
        
        if (card.steps) {
          content += `*Procedura:*\n`;
          card.steps.forEach(s => content += `- ${s}\n`);
          content += `\n`;
        }

        if (card.goodWith) content += `*In Sinergia Con:* ${card.goodWith}\n\n`;
        if (card.hint) content += `> Suggerimento: ${card.hint}\n\n`;

        const note = cardNotes[card.code || card.id];
        if (note) {
          content += `**Le mie Note:**\n${note}\n\n`;
        }
        content += `--------------------------------------------------\n\n`;
      });
    }

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = userName 
      ? `Portfolio_${userName.replace(/\s+/g, '_')}.md`
      : 'Mio_Portfolio_SCAFFOLD.md';
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // --- 2. FUNZIONE ESPORTA IN PDF VIA NUOVA SCHEDA SICURA ---
  const handleExportPDF = () => {
    const printArea = document.getElementById('portfolio-print-area');
    if (!printArea || !printArea.children.length) return;

    // Crea la nuova finestra
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Il browser ha bloccato la finestra di stampa. Abilita i popup per scaricare il PDF.");
      return;
    }

    // Dividiamo le carte in gruppi di 9 per la paginazione
    const cards = Array.from(printArea.children);
    let chunksHtml = '';
    for (let i = 0; i < cards.length; i += 9) {
      const chunk = cards.slice(i, i + 9);
      chunksHtml += `<div class="print-grid">`;
      chunk.forEach(card => {
        chunksHtml += card.outerHTML;
      });
      chunksHtml += `</div>`;
    }

    // Costruisce la pagina HTML pulita da mandare in stampa
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="it">
      <head>
        <meta charset="UTF-8">
        <title>${activeTab === 'deck' ? 'SCAFFOLD DECK' : `Portfolio di ${userName || 'SCAFFOLD'}`}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          @page {
            size: A4;
            margin: 1cm;
          }
          body { 
            background: white !important; 
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          
          .print-card { 
            page-break-inside: avoid !important; 
            break-inside: avoid !important;
            border: 1px solid #d4d4d8 !important;
            border-radius: 0.5rem;
            width: 100%;
            height: 8.5cm; /* Ridotto da 8.8cm per evitare overflow */
            display: flex;
            flex-direction: column;
            overflow: hidden;
            background: white !important;
            box-sizing: border-box !important;
          }
          
          .print-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: repeat(3, 8.5cm);
            align-content: start;
            gap: 4mm;
            width: 100%;
            height: 26.5cm; /* Altezza fissa del contenitore per forzare il break */
            page-break-after: always;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          /* Forzature per sfondi e icone */
          .bg-gradient-to-br { background-image: none !important; background-color: #f8fafc !important; }
          .print\\:bg-none { background-image: none !important; }
          .print\\:bg-zinc-50 { background-color: #fafafa !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:flex { display: flex !important; }
          .print\\:text-zinc-800 { color: #27272a !important; }
          .print\\:font-bold { font-weight: 700 !important; }
          
          @media print {
            #loading { display: none !important; }
            #content { display: block !important; }
            .print-grid:last-child { page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <div id="loading" style="text-align:center; padding: 100px; font-size:24px; font-weight:900; color:#4f46e5; font-style:italic;">
          Generazione PDF in corso, attendere 2 secondi...
        </div>
        <div id="content" class="max-w-6xl mx-auto p-0" style="display:none;">
          ${chunksHtml}
        </div>
        <script>
          // Attendiamo che Tailwind carichi gli stili prima di chiamare il popup di stampa
          setTimeout(() => {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            setTimeout(() => {
              window.print();
            }, 500);
          }, 2000);
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Determina le carte visibili
  const visibleCards = useMemo(() => {
    if (activeTab === 'portfolio') {
      return allCardsList.filter(c => selectedCards.has(c.code || c.id));
    }

    if (activeTab === 'deck') {
      return allCardsList;
    }

    if (!isGuided) {
      return cardsData[activeTab]?.map(c => ({ ...c, catId: activeTab })) || [];
    }
    
    let cards = [];
    currentStep.categories.forEach(catId => {
      if (currentStep.id === 3 && compSubFilter !== 'all' && catId !== compSubFilter) return;

      let catCards = cardsData[catId] || [];
      if (currentStep.filter) {
        catCards = catCards.filter(currentStep.filter);
      }
      cards = [...cards, ...catCards.map(c => ({ ...c, catId }))];
    });
    return cards;
  }, [isGuided, currentStepIndex, activeTab, compSubFilter, allCardsList, selectedCards]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans text-zinc-900">
      
      {/* Sidebar Navigazione COMPATTA */}
      <div className="bg-[#1a1b1e] w-full lg:w-64 flex-shrink-0 flex flex-col shadow-2xl z-20 lg:h-screen lg:sticky lg:top-0 border-r border-slate-800 no-print">
        <div className="p-5 border-b border-slate-800 bg-[#0d0e10] text-center">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic flex items-center justify-center gap-2">
            <Layout size={24} className="text-zinc-100" />
            <div className="flex tracking-tighter">
              <span className="text-[#f37021]">S</span>
              <span className="text-[#91278f]">C</span>
              <span className="text-[#8dc63f]">A</span>
              <span className="text-[#00a651]">F</span>
              <span className="text-[#00aeef]">F</span>
              <span className="text-[#3ab54a]">O</span>
              <span className="text-[#2e3192]">L</span>
              <span className="text-[#6d6e71]">D</span>
            </div>
          </h1>
          <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.3em] mt-2">Design Kit Interattivo</p>
        </div>
        
        {/* Pulsante Portfolio - GIOVANI */}
        <div className="p-3 border-b border-slate-800">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 px-2">Per i Giovani</div>
          <button 
            onClick={() => { setIsGuided(false); setActiveTab('instructions'); }}
            className={`w-full py-3 rounded-xl flex items-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all px-4 mb-2 ${activeTab === 'instructions' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'bg-slate-800 text-white hover:bg-indigo-500'}`}
          >
            <Info size={18} />
            Istruzioni
          </button>
          <button 
            onClick={handlePortfolioClick}
            className={`w-full py-3 rounded-xl flex items-center gap-3 font-black text-[11px] uppercase tracking-widest transition-all px-4 ${activeTab === 'portfolio' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/40' : 'bg-slate-800 text-white hover:bg-indigo-500'}`}
          >
            <PortfolioIcon size={18} />
            Mio Portfolio
            {selectedCards.size > 0 && (
              <span className="ml-auto bg-white text-indigo-600 px-2 py-0.5 rounded-full text-[10px] font-black shadow-inner">
                {selectedCards.size}
              </span>
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
          {isGuided ? (
            <div>
              <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 px-2">Percorso Formatore</div>
              <div className="space-y-1">
                {processSteps.map((step, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`w-full p-3 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${idx === currentStepIndex ? 'bg-emerald-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${idx === currentStepIndex ? 'border-white' : 'border-zinc-700'}`}>{idx + 1}</span>
                    {step.title.split('. ')[1]}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* SEZIONE COMPETENZE */}
              <div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 px-2">Competenze</div>
                <div className="space-y-1">
                  {categories.filter(c => ['digcomp', 'entrecomp', 'lifecomp', 'greencomp', 'transversal'].includes(c.id)).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setIsGuided(false); setActiveTab(cat.id); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-black transition-all ${
                        activeTab === cat.id ? `${cat.color} text-white shadow-xl scale-[1.03]` : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <cat.icon size={18} />
                      <span className="uppercase tracking-[0.1em]">{cat.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SEZIONE FORMATORI */}
              <div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 px-2">Strumenti Formatore</div>
                <div className="space-y-1">
                  {categories.filter(c => ['setting', 'planning', 'methods', 'assessment'].includes(c.id)).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => { setIsGuided(false); setActiveTab(cat.id); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-black transition-all ${
                        activeTab === cat.id ? `${cat.color} text-white shadow-xl scale-[1.03]` : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <cat.icon size={18} />
                      <span className="uppercase tracking-[0.1em]">{cat.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* SEZIONE MATERIALI */}
              <div>
                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2 px-2 mt-4">Materiali</div>
                <div className="space-y-1">
                  <button
                    onClick={() => { setIsGuided(false); setActiveTab('deck'); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-black transition-all ${
                      activeTab === 'deck' ? `bg-slate-800 text-white shadow-xl scale-[1.03]` : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <Layers size={18} />
                    <span className="uppercase tracking-[0.1em]">Deck Completo</span>
                  </button>
                  <button
                    onClick={() => { setIsGuided(false); setActiveTab('credits'); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[11px] font-black transition-all ${
                      activeTab === 'credits' ? `bg-amber-500 text-white shadow-xl scale-[1.03]` : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <Star size={18} />
                    <span className="uppercase tracking-[0.1em]">Credits</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </nav>

        {/* Pulsante Avvia Percorso - FORMATORI (in basso) */}
        <div className="p-3 border-t border-slate-800 bg-[#1a1b1e]">
          <button 
            onClick={() => {
              setIsGuided(!isGuided);
              if (!isGuided && activeTab === 'portfolio') {
                setActiveTab('setting'); // Reset tab
              }
              setCompSubFilter('all');
            }}
            className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${isGuided ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white'}`}
          >
            <PlayCircle size={18} />
            {isGuided ? 'Esci dal Percorso' : 'Avvia Percorso Formatore'}
          </button>
        </div>
      </div>

      {/* Main Board Content */}
      <main className="flex-1 overflow-y-auto bg-slate-200">

        <div className="p-6 lg:p-12 max-w-7xl mx-auto">
          
          {activeTab === 'instructions' ? (
            <div className="bg-white p-10 lg:p-16 rounded-[3rem] shadow-2xl border-b-[10px] border-indigo-500 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic mb-6">
                🚀 Istruzioni "Portfolio delle Competenze"
              </h1>
              <p className="text-xl text-slate-600 font-medium leading-relaxed mb-12">
                Benvenuti nel nostro spazio di lavoro virtuale! Oggi trasformeremo il nostro anno di Servizio Civile o di Volontariato in un vero e proprio Portfolio visivo e collaborativo. L'obiettivo è rendere visibile tutto ciò che avete imparato sul campo.
                <br/><br/>
                Seguite questi semplici passaggi:
              </p>

              <div className="space-y-10">
                {/* Step 1 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">1</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">"Esplora la Galleria delle Competenze"</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Troverete sparse diverse carte colorate. Sono le carte Scaffold, che rappresentano le competenze chiave europee. Noterete colori diversi:
                    </p>
                    <ul className="mt-4 space-y-3 text-lg">
                      <li className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-[#8dc63f] shadow-sm"></span> <strong>Verde (LifeComp & GreenComp):</strong> Competenze personali, sociali, imparare a imparare e sostenibilità.</li>
                      <li className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-[#91278f] shadow-sm"></span> <strong>Viola (EntreComp):</strong> Competenze imprenditoriali e spirito di iniziativa.</li>
                      <li className="flex items-center gap-3"><span className="w-4 h-4 rounded-full bg-[#f37021] shadow-sm"></span> <strong>Arancione (DigComp):</strong> Competenze digitali.</li>
                    </ul>
                    <p className="text-slate-500 leading-relaxed mt-4 italic">
                      Prendetevi qualche minuto per navigare nello spazio virtuale, fare zoom sulle carte e leggere le descrizioni.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">2</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">"Scegli le tue Competenze"</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Mentre leggete, individuate <strong>2 o 3 competenze</strong> che sentite di aver allenato, scoperto o messo alla prova durante questa esperienza di volontariato. Cliccate sul cerchio in alto a destra di ogni carta per aggiungerla al vostro Portfolio.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">3</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">"Raccontati le tue esperienze" <span className="text-lg text-slate-500 font-medium">(Crea un Post-it virtuale)</span></h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Ora tocca a voi creare i contenuti! Andate nella sezione "Mio Portfolio" e nello spazio "Le mie Note" sotto ogni carta scrivete un esempio pratico.
                    </p>
                    <div className="mt-4 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                      <p className="text-amber-800 italic">
                        <strong>Esempio:</strong> Non limitatevi a concetti astratti. Raccontate un episodio reale. Invece di scrivere "Ho imparato il lavoro di squadra", scrivete "Ho gestito i turni della mensa collaborando con 4 colleghi durante un'emergenza".
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">4</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">"Stampa il tuo Portfolio e preparati a condividerlo"</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Costruisci il tuo Portfolio e, una volta completato, esportalo in PDF o scaricalo. Inseriscilo poi nella bacheca digitale predisposta dal formatore.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">5</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">Interagisci e fai Peer Feedback <span className="text-lg text-slate-500 font-medium">(Feedback tra pari)</span></h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Il lavoro non finisce con il vostro portfolio. Esplorate la bacheca digitale e leggete le esperienze dei vostri colleghi. Utilizzate le funzioni della bacheca per collaborare: lasciate un "mi piace", aggiungete un commentino o un'emoji di reazione ai post-it degli altri.
                    </p>
                  </div>
                </div>

                {/* Step 6 */}
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">6</div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">"Pronti per la Plenaria"</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Quando il tempo sarà scaduto, ci ritroveremo in videochiamata. Osserveremo insieme la mappa visiva che abbiamo creato per riflettere su quali aree sono più ricche di esperienze e quali invece sono rimaste vuote, condividendo le nostre storie a voce.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 text-center">
                <button 
                  onClick={() => setActiveTab('digcomp')}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl"
                >
                  Inizia l'Esplorazione
                </button>
              </div>
            </div>
          ) : activeTab === 'credits' ? (
            <div className="bg-white p-10 lg:p-16 rounded-[3rem] shadow-2xl border-b-[10px] border-amber-500 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-amber-100 text-amber-600 rounded-2xl">
                  <Star size={40} strokeWidth={2} />
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter italic">
                  Credits
                </h1>
              </div>
              
              <div className="space-y-8 text-lg text-slate-700 leading-relaxed">
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <p className="font-bold text-xl text-slate-900 mb-2">di Antonio Scaramuzzino</p>
                  <p className="text-slate-600">rilasciato sotto la licenza Creative Commons Attribution 4.0 International (CC BY 4.0)</p>
                </div>

                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                  <p className="mb-4">
                    European Commission, Joint Research Centre, Bacigalupo, M., Binasco, A., Bekh, O., Israel, H. and Weikert García, L., "Scaffold", a deck of cards to design competence-oriented learning experiences, Publications Office of the European Union, Luxembourg, 2024, <a href="https://data.europa.eu/doi/10.2760/057661" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">https://data.europa.eu/doi/10.2760/057661</a>, JRC136622
                  </p>
                  <p className="mb-4">
                    Scaffold è un prodotto sviluppato congiuntamente dalla European Training Foundation (ETF) e dal Joint Research Centre (JRC) della Commissione Europea.
                  </p>
                  <p className="font-bold">
                    Copyright: © European Union, 2024
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <header className="mb-12 no-print">
            {activeTab === 'deck' ? (
              <div className="bg-slate-800 p-10 rounded-[3rem] shadow-2xl text-white flex flex-col xl:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="flex items-center gap-6 z-10 w-full xl:w-auto">
                  <div className="p-6 bg-white/10 rounded-full backdrop-blur-md hidden sm:block">
                    <Layers size={48} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none mb-4">
                      Deck Completo
                    </h2>
                    <p className="text-slate-300 font-bold uppercase tracking-[0.2em] text-sm">
                      {allCardsList.length} Carte totali
                    </p>
                  </div>
                </div>
                
                {/* BOTTONI DI DOWNLOAD E STAMPA */}
                <div className="flex flex-col sm:flex-row gap-4 z-10 w-full xl:w-auto">
                  <button 
                    onClick={handleExportPDF}
                    className="bg-white text-slate-800 px-6 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-slate-50 hover:scale-105 transition-all shadow-xl"
                  >
                    <Printer size={22} />
                    <span>Stampa Deck</span>
                  </button>
                </div>
              </div>
            ) : activeTab === 'portfolio' ? (
              <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-2xl text-white flex flex-col xl:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="flex items-center gap-6 z-10 w-full xl:w-auto">
                  <div className="p-6 bg-white/10 rounded-full backdrop-blur-md hidden sm:block">
                    <PortfolioIcon size={48} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-4xl sm:text-5xl font-black tracking-tighter uppercase italic leading-none mb-4">
                      {userName ? `Il Portfolio di ${userName}` : 'Il Mio Portfolio'}
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <input 
                        type="text" 
                        placeholder="Inserisci il tuo nome..." 
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="bg-indigo-700/50 border border-indigo-400 text-white placeholder:text-indigo-300 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-white w-full sm:w-64 font-medium"
                      />
                      <p className="text-indigo-200 font-bold uppercase tracking-[0.2em] text-sm">
                        {selectedCards.size} Competenze
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* BOTTONI DI DOWNLOAD E STAMPA */}
                <div className="flex flex-col sm:flex-row gap-4 z-10 w-full xl:w-auto">
                  <button 
                    onClick={handleDownloadMarkdown}
                    className="bg-white/10 border border-white/20 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all disabled:opacity-50"
                    disabled={selectedCards.size === 0}
                  >
                    <Download size={22} />
                    <span>Scarica .md</span>
                  </button>

                  <button 
                    onClick={handleExportPDF}
                    className="bg-white text-indigo-600 px-6 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-50 hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                    disabled={selectedCards.size === 0}
                  >
                    <Printer size={22} />
                    <span>Esporta in PDF</span>
                  </button>
                </div>
              </div>
            ) : isGuided ? (
              <div className="bg-white p-10 rounded-[3rem] shadow-2xl border-b-[10px] border-emerald-500 relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-5 mb-5">
                      <span className="bg-emerald-500 text-white text-[12px] font-black px-4 py-2 rounded-full tracking-widest uppercase shadow-md">PASSO {currentStepIndex + 1} / 9</span>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{currentStep.title}</h2>
                    </div>
                    <p className="text-slate-600 text-xl font-bold italic leading-relaxed bg-slate-50 p-4 border-l-4 border-emerald-200 rounded-r-xl">
                      "{currentStep.instruction}"
                    </p>
                    
                    {currentStep.id === 3 && (
                      <div className="flex flex-wrap gap-2 mt-6 p-3 bg-zinc-100 rounded-2xl border border-zinc-200 shadow-inner">
                        {[
                          {id: 'all', label: 'TUTTI I FRAMEWORK'},
                          {id: 'digcomp', label: 'DIGCOMP (Digitali)'},
                          {id: 'entrecomp', label: 'ENTRECOMP (Impresa)'},
                          {id: 'lifecomp', label: 'LIFECOMP (Personali)'},
                          {id: 'greencomp', label: 'GREENCOMP (Ambiente)'},
                          {id: 'transversal', label: 'TRASVERSALI'}
                        ].map(f => (
                          <button
                            key={f.id}
                            onClick={() => setCompSubFilter(f.id)}
                            className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                              compSubFilter === f.id ? 'bg-zinc-900 text-white shadow-lg scale-105' : 'bg-white text-zinc-500 border border-zinc-200 hover:bg-zinc-50 hover:text-zinc-800'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 shrink-0">
                    <button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} className="p-6 rounded-full bg-white border-2 border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-30 transition-all shadow-sm">
                      <ChevronLeft size={36} />
                    </button>
                    <button onClick={() => setCurrentStepIndex(Math.min(processSteps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === processSteps.length - 1} className="p-6 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 shadow-2xl transition-all scale-110">
                      <ChevronRight size={36} />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10 border-b-4 border-slate-300 pb-8 md:pb-12">
                <div className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-white shadow-2xl ${currentCategory.color} rotate-[-2deg] self-start md:self-auto`}>
                  <currentCategory.icon className="w-12 h-12 md:w-16 md:h-16" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{currentCategory.title}</h2>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4 mt-4 md:ml-1">
                    <p className="text-slate-500 font-black uppercase tracking-[0.1em] md:tracking-[0.2em] text-xs md:text-sm italic opacity-80">{currentCategory.description}</p>
                    <span className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-[10px] md:text-xs font-black tracking-widest uppercase self-start sm:self-auto">
                      {visibleCards.length} Carte
                    </span>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* Griglia delle Carte */}
          {activeTab === 'portfolio' && visibleCards.length === 0 ? (
            <div className="bg-white p-20 rounded-[3rem] shadow-sm border border-zinc-200 text-center">
              <PortfolioIcon size={80} className="mx-auto text-zinc-200 mb-6" />
              <h3 className="text-3xl font-black uppercase tracking-tighter italic text-zinc-400 mb-4">Il tuo Portfolio è vuoto</h3>
              <p className="text-lg text-zinc-500 font-medium">Esplora le librerie o avvia il Percorso Guidato per iniziare.<br/>Clicca sul cerchio in alto a destra di una carta per aggiungerla.</p>
            </div>
          ) : (
            <div id="portfolio-print-area" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12 mb-32 items-stretch">
              {visibleCards.map((card, index) => (
                <Card 
                  key={`${card.code || card.id}-${index}`} 
                  card={card} 
                  categoryId={card.catId} 
                  isSelected={selectedCards.has(card.code || card.id)}
                  onToggle={handleToggleSelection}
                  onOpenDetails={activeTab === 'portfolio' ? null : handleOpenDetails}
                  note={cardNotes[card.code || card.id]}
                  onNoteChange={activeTab === 'portfolio' ? handleNoteChange : undefined}
                  isPortfolioView={activeTab === 'portfolio'}
                  isDeckView={activeTab === 'deck'}
                />
              ))}
            </div>
          )}

          {/* Footer Informazioni */}
          <footer className="bg-white p-16 rounded-[4rem] shadow-2xl border-2 border-slate-200 flex flex-col md:flex-row items-center gap-12 no-print">
            <div className={`p-10 rounded-full ${isGuided ? 'bg-emerald-500 shadow-emerald-200' : (activeTab === 'portfolio' ? 'bg-indigo-600' : activeTab === 'deck' ? 'bg-slate-800' : currentCategory.color) + ' shadow-slate-200'} text-white shadow-2xl scale-110`}>
              <Info size={56} strokeWidth={3} />
            </div>
            <div className="text-center md:text-left">
              <h4 className="font-black text-slate-900 text-3xl mb-4 italic uppercase tracking-tighter">"L'apprendimento è come una torre, bisogna costruirla passo dopo passo"</h4>
              <p className="text-slate-500 leading-snug font-black text-xl max-w-5xl italic opacity-70 uppercase tracking-tight">
                Toolkit Ufficiale SCAFFOLD. Usa la funzione "Il Mio Portfolio" per raccogliere le carte, e scegli se scaricarle in formato Testo (.md) o esportarle in PDF tramite la nuova scheda.
              </p>
            </div>
          </footer>
            </>
          )}
        </div>
      </main>

      {/* Renderizza il Modale dei Dettagli se una carta è stata cliccata */}
      {detailCard && (
        <DetailModal
          card={detailCard.card}
          category={detailCard.category}
          note={cardNotes[detailCard.card.code || detailCard.card.id]}
          onNoteChange={handleNoteChange}
          onClose={() => setDetailCard(null)}
          isSelected={selectedCards.has(detailCard.card.code || detailCard.card.id)}
          onToggle={handleToggleSelection}
        />
      )}
    </div>
  );
}
