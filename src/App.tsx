import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  Map, 
  Compass, 
  Utensils, 
  ShoppingBag, 
  Ticket, 
  Menu, 
  X, 
  ChevronRight, 
  MapPin, 
  Star,
  Clock,
  Info,
  Calendar as CalendarIcon,
  User,
  MessageSquare,
  CheckCircle2,
  Upload,
  LogOut
} from 'lucide-react';

// --- Mock Data ---
const GUIDES = [
  { id: 'g1', name: '林青', role: '资深文化导游', image: 'https://picsum.photos/seed/guide1/400/500', tags: ['历史讲解', '幽默风趣'] },
  { id: 'g2', name: '张远', role: '生态探险向导', image: 'https://picsum.photos/seed/guide2/400/500', tags: ['植物科普', '户外急救'] },
  { id: 'g3', name: '苏婉', role: '亲子游专家', image: 'https://picsum.photos/seed/guide3/400/500', tags: ['耐心细致', '儿童互动'] },
];

const FOODS = [
  { id: 'f1', name: '云隐竹筒饭', desc: '采摘清晨翠竹，搭配高山香米与秘制腊肉。', image: 'https://picsum.photos/seed/food1/600/400', price: '¥38' },
  { id: 'f2', name: '仙谷桃花酿', desc: '三月桃花古法酿制，入口甘甜，回味悠长。', image: 'https://picsum.photos/seed/food2/600/400', price: '¥58' },
  { id: 'f3', name: '野菌土鸡汤', desc: '深山散养土鸡与珍稀野菌慢熬六小时。', image: 'https://picsum.photos/seed/food3/600/400', price: '¥128' },
  { id: 'f4', name: '翠玉荷花酥', desc: '传统手工糕点，形似荷花，酥脆可口。', image: 'https://picsum.photos/seed/food4/600/400', price: '¥28' },
];

const MERCH = [
  { id: 'm1', name: '「云深不知处」香薰蜡烛', desc: '提取谷中松柏与晨露的清香。', image: 'https://picsum.photos/seed/merch1/500/500', price: '¥88' },
  { id: 'm2', name: '仙谷四季明信片套盒', desc: '收录景区春夏秋冬绝美摄影作品。', image: 'https://picsum.photos/seed/merch2/500/500', price: '¥45' },
  { id: 'm3', name: '手工竹编茶具套装', desc: '非遗传承人纯手工编制，古朴典雅。', image: 'https://picsum.photos/seed/merch3/500/500', price: '¥299' },
  { id: 'm4', name: '神兽祈福御守', desc: '源自仙谷古老传说的守护符。', image: 'https://picsum.photos/seed/merch4/500/500', price: '¥35' },
];

const TICKETS = [
  { id: 'standard', name: '成人标准票', desc: '包含景区所有公共开放区域', price: 198, features: ['全天无限次进出', '免费乘坐观光车', '包含基础意外险'] },
  { id: 'child', name: '儿童/学生票', desc: '适用于1.2m-1.5m儿童及全日制学生', price: 98, features: ['全天无限次进出', '免费乘坐观光车', '需出示有效证件'] },
  { id: 'vip', name: 'VIP尊享套票', desc: '享受免排队及专属导游服务', price: 588, features: ['所有项目免排队', '专属金牌导游(4小时)', '包含一顿特色午餐', '免费VIP休息室'] },
];

const INITIAL_REVIEWS: Record<string, any[]> = {
  'g1': [
    { id: 1, user: '游客A', rating: 5, comment: '林导游讲解非常生动，历史知识渊博！强烈推荐。', date: '2026-03-20' },
    { id: 2, user: '山水客', rating: 5, comment: '风趣幽默，一路上欢声笑语，照顾得很周到。', date: '2026-03-15' }
  ],
  'g2': [
    { id: 3, user: '探险家', rating: 4, comment: '张导对植物非常了解，学到了很多野外知识。', date: '2026-03-18' }
  ],
  'g3': [
    { id: 4, user: '宝妈日记', rating: 5, comment: '苏婉导游对小朋友特别有耐心，孩子非常喜欢她！', date: '2026-03-21' }
  ],
  'f1': [
    { id: 5, user: '吃货小王', rating: 4, comment: '竹筒饭很香，腊肉味道纯正，就是稍微有点油。', date: '2026-03-19' }
  ],
  'm1': [
    { id: 6, user: '文艺青年', rating: 5, comment: '味道很清新，包装也很好看，适合送人。', date: '2026-03-10' }
  ]
};

// --- Helper Components ---
const StarRating = ({ rating, setRating, interactive = false }: { rating: number, setRating?: (r: number) => void, interactive?: boolean }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`w-5 h-5 ${interactive ? 'cursor-pointer transition-transform hover:scale-110' : ''} ${star <= rating ? 'fill-amber-500 text-amber-500' : 'fill-stone-200 text-stone-200'}`}
          onClick={() => interactive && setRating && setRating(star)}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for Auth & User
  const [currentUser, setCurrentUser] = useState<{id: number, email: string} | null>(null);
  const [userTickets, setUserTickets] = useState<any[]>([]);
  const [authModal, setAuthModal] = useState({ isOpen: false, isLogin: true, email: '', password: '', error: '' });
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // State for Payment
  const [paymentModal, setPaymentModal] = useState<{isOpen: boolean, ticket: any | null, isSuccess: boolean, paymentImage: string}>({
    isOpen: false, 
    ticket: null, 
    isSuccess: false, 
    paymentImage: 'https://picsum.photos/seed/qr/300/300'
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for Reviews
  const [reviewsData, setReviewsData] = useState<Record<string, any[]>>(INITIAL_REVIEWS);
  const [reviewModal, setReviewModal] = useState<{isOpen: boolean, targetId: string | null, targetName: string}>({isOpen: false, targetId: null, targetName: ''});
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  // State for Booking
  const [bookingModal, setBookingModal] = useState<{isOpen: boolean, guide: any | null}>({isOpen: false, guide: null});
  const [bookingState, setBookingState] = useState({ date: '', time: '', name: '', phone: '', isSuccess: false });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- Review Logic ---
  const getAverageRating = (id: string) => {
    const itemReviews = reviewsData[id] || [];
    if (itemReviews.length === 0) return '5.0';
    const sum = itemReviews.reduce((acc, rev) => acc + rev.rating, 0);
    return (sum / itemReviews.length).toFixed(1);
  };

  const getReviewCount = (id: string) => {
    return (reviewsData[id] || []).length;
  };

  const openReviewModal = (id: string, name: string) => {
    setReviewModal({ isOpen: true, targetId: id, targetName: name });
    setNewReview({ rating: 5, comment: '' });
  };

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModal.targetId || !newReview.comment.trim()) return;
    
    const newReviewObj = {
      id: Date.now(),
      user: '匿名游客',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0]
    };

    setReviewsData(prev => ({
      ...prev,
      [reviewModal.targetId!]: [newReviewObj, ...(prev[reviewModal.targetId!] || [])]
    }));
    
    setNewReview({ rating: 5, comment: '' });
  };

  // --- Booking Logic ---
  const openBookingModal = (guide: any) => {
    setBookingModal({ isOpen: true, guide });
    setBookingState({ date: '', time: '', name: '', phone: '', isSuccess: false });
  };

  const submitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingState.date || !bookingState.time || !bookingState.name || !bookingState.phone) return;
    
    // Simulate API call
    setTimeout(() => {
      setBookingState(prev => ({ ...prev, isSuccess: true }));
      setTimeout(() => {
        setBookingModal({ isOpen: false, guide: null });
      }, 2000);
    }, 800);
  };

  // Generate next 14 days for calendar
  const next14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Start from tomorrow
    return d;
  });

  // --- Auth Logic ---
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthModal(prev => ({ ...prev, error: '' }));
    if (!authModal.email || !authModal.password) return;

    const endpoint = authModal.isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authModal.email, password: authModal.password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      setCurrentUser({ id: data.id, email: data.email });
      setAuthModal({ ...authModal, isOpen: false, email: '', password: '', error: '' });
      fetchUserTickets(data.id);
    } catch (error: any) {
      setAuthModal(prev => ({ ...prev, error: error.message }));
    }
  };

  const fetchUserTickets = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/${userId}/tickets`);
      if (response.ok) {
        const tickets = await response.json();
        setUserTickets(tickets);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserTickets([]);
    setProfileModalOpen(false);
  };

  // --- Payment & Ticket Logic ---
  const handleBuyTicket = (ticket: any) => {
    if (!currentUser) {
      setAuthModal({ ...authModal, isOpen: true });
      return;
    }
    setPaymentModal(prev => ({ ...prev, isOpen: true, ticket, isSuccess: false }));
  };

  const handlePaymentSubmit = async () => {
    if (!paymentModal.ticket || !currentUser) return;
    
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          ticket: paymentModal.ticket
        })
      });

      if (!response.ok) throw new Error('Failed to purchase ticket');
      
      const newTicket = await response.json();
      
      setUserTickets(prev => [newTicket, ...prev]);
      setPaymentModal(prev => ({ ...prev, isSuccess: true }));
      
      setTimeout(() => {
        setPaymentModal(prev => ({ ...prev, isOpen: false, ticket: null }));
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('支付失败，请重试');
    }
  };

  const handlePaymentImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPaymentModal(prev => ({ ...prev, paymentImage: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-emerald-900 selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo('home')}>
            <Compass className={`w-8 h-8 ${isScrolled ? 'text-emerald-900' : 'text-white'}`} />
            <span className={`font-serif font-bold text-xl tracking-wider ${isScrolled ? 'text-stone-900' : 'text-white'}`}>云隐仙谷</span>
          </div>
          
          {/* Desktop Nav */}
          <div className={`hidden md:flex items-center gap-8 font-medium text-sm tracking-wide ${isScrolled ? 'text-stone-600' : 'text-white/90'}`}>
            <button onClick={() => scrollTo('map')} className="hover:text-emerald-500 transition-colors">地图导览</button>
            <button onClick={() => scrollTo('guides')} className="hover:text-emerald-500 transition-colors">专属导游</button>
            <button onClick={() => scrollTo('food')} className="hover:text-emerald-500 transition-colors">美食地图</button>
            <button onClick={() => scrollTo('merch')} className="hover:text-emerald-500 transition-colors">文创商品</button>
            <button 
              onClick={() => scrollTo('tickets')} 
              className={`px-5 py-2.5 rounded-full transition-all ${isScrolled ? 'bg-emerald-900 text-white hover:bg-emerald-800' : 'bg-white text-emerald-900 hover:bg-white/90'}`}
            >
              立即购票
            </button>
            {currentUser ? (
              <button 
                onClick={() => setProfileModalOpen(true)}
                className={`flex items-center gap-2 hover:text-emerald-500 transition-colors`}
              >
                <User className="w-5 h-5" />
                <span>我的票夹</span>
              </button>
            ) : (
              <button 
                onClick={() => setAuthModal({ ...authModal, isOpen: true })}
                className={`hover:text-emerald-500 transition-colors`}
              >
                登录
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className={`w-6 h-6 ${isScrolled ? 'text-stone-900' : 'text-white'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${isScrolled ? 'text-stone-900' : 'text-white'}`} />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-white pt-24 px-6 flex flex-col gap-6 md:hidden"
          >
            <button onClick={() => scrollTo('map')} className="text-2xl font-serif text-left border-b border-stone-100 pb-4">地图导览</button>
            <button onClick={() => scrollTo('guides')} className="text-2xl font-serif text-left border-b border-stone-100 pb-4">专属导游</button>
            <button onClick={() => scrollTo('food')} className="text-2xl font-serif text-left border-b border-stone-100 pb-4">美食地图</button>
            <button onClick={() => scrollTo('merch')} className="text-2xl font-serif text-left border-b border-stone-100 pb-4">文创商品</button>
            <button onClick={() => scrollTo('tickets')} className="text-2xl font-serif text-left border-b border-stone-100 pb-4 text-emerald-700">门票预订</button>
            {currentUser ? (
              <button 
                onClick={() => { setMobileMenuOpen(false); setProfileModalOpen(true); }} 
                className="text-2xl font-serif text-left flex items-center gap-2"
              >
                <User className="w-6 h-6" /> 我的票夹
              </button>
            ) : (
              <button 
                onClick={() => { setMobileMenuOpen(false); setAuthModal({ ...authModal, isOpen: true }); }} 
                className="text-2xl font-serif text-left"
              >
                登录 / 注册
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/scenery1/1920/1080" 
            alt="云隐仙谷风景" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-stone-50"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-white/80 uppercase tracking-[0.3em] text-sm md:text-base mb-6 font-medium"
          >
            探索未知的自然奇迹
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl lg:text-[10rem] font-serif font-bold text-white leading-none tracking-tight mb-8 drop-shadow-lg"
          >
            云隐仙谷
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <button 
              onClick={() => scrollTo('tickets')}
              className="group relative inline-flex items-center justify-center px-8 py-4 bg-emerald-700 text-white font-medium text-lg rounded-full overflow-hidden transition-all hover:bg-emerald-800 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                开启仙境之旅 <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-6">全景导览</h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-8">
              仙谷占地广阔，分为「云海观景台」、「幽林秘境」、「飞瀑流泉」三大核心区域。使用我们的交互式地图，轻松规划您的完美路线。
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-stone-700">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <MapPin className="w-5 h-5" />
                </div>
                <span className="font-medium">3大核心景区，20+打卡点</span>
              </li>
              <li className="flex items-center gap-3 text-stone-700">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="font-medium">建议游玩时间：4-6小时</span>
              </li>
            </ul>
            <button className="text-emerald-700 font-medium flex items-center gap-2 hover:gap-3 transition-all">
              查看高清地图 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="w-full md:w-2/3 relative">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative group">
              <img 
                src="https://picsum.photos/seed/map/1200/900?blur=2" 
                alt="景区地图" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Interactive Map Pins */}
              <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
              <div className="absolute top-1/2 left-2/3 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
              
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="bg-white/90 backdrop-blur text-stone-900 px-6 py-3 rounded-full font-medium flex items-center gap-2">
                  <Map className="w-5 h-5" /> 进入交互地图
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guides Section */}
      <section id="guides" className="py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">专属金牌导游</h2>
            <p className="text-stone-600 max-w-2xl mx-auto text-lg">
              让最了解这片土地的人，带您深入体验仙谷的自然与人文魅力。
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {GUIDES.map((guide) => (
              <motion.div 
                key={guide.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                <div className="aspect-[4/5] relative">
                  <img 
                    src={guide.image} 
                    alt={guide.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <h3 className="text-2xl font-serif font-bold text-white mb-1">{guide.name}</h3>
                    <p className="text-white/80 text-sm">{guide.role}</p>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div 
                    className="flex items-center justify-between mb-4 cursor-pointer group"
                    onClick={() => openReviewModal(guide.id, guide.name)}
                  >
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-stone-900">{getAverageRating(guide.id)}</span>
                      <span className="text-stone-400 text-sm group-hover:text-emerald-600 transition-colors">
                        ({getReviewCount(guide.id)} 评价) <ChevronRight className="inline w-3 h-3" />
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {guide.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto">
                    <button 
                      onClick={() => openBookingModal(guide)}
                      className="w-full py-3 bg-stone-900 text-white rounded-xl font-medium hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <CalendarIcon className="w-4 h-4" /> 查看档期并预约
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Section */}
      <section id="food" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">寻味仙谷</h2>
            <p className="text-stone-600 text-lg max-w-xl">
              就地取材，古法烹饪。在山水之间，品尝大自然最纯粹的馈赠。
            </p>
          </div>
          <button className="flex items-center gap-2 text-emerald-700 font-medium hover:text-emerald-800">
            查看完整菜单 <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOODS.map((food, index) => (
            <div key={food.id} className={`group ${index === 0 || index === 3 ? 'md:col-span-2 lg:col-span-2' : ''}`}>
              <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4">
                <img 
                  src={food.image} 
                  alt={food.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold text-stone-900">
                  {food.price}
                </div>
              </div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-serif font-bold text-stone-900">{food.name}</h3>
                <div 
                  className="flex items-center gap-1 text-amber-500 text-sm cursor-pointer hover:text-amber-600"
                  onClick={() => openReviewModal(food.id, food.name)}
                >
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium text-stone-700">{getAverageRating(food.id)}</span>
                </div>
              </div>
              <p className="text-stone-500 text-sm line-clamp-2 mb-3">{food.desc}</p>
              <button 
                onClick={() => openReviewModal(food.id, food.name)}
                className="text-xs text-emerald-700 font-medium flex items-center gap-1 hover:underline"
              >
                <MessageSquare className="w-3 h-3" /> 查看/写评价 ({getReviewCount(food.id)})
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Merch Section */}
      <section id="merch" className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">仙谷文创</h2>
            <p className="text-stone-400 max-w-2xl mx-auto text-lg">
              将仙谷的记忆带回家。每一件商品，都蕴含着这里的故事与温度。
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {MERCH.map((item) => (
              <div key={item.id} className="group flex flex-col">
                <div className="aspect-square bg-stone-800 rounded-2xl overflow-hidden mb-6 relative">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                    <button className="bg-white text-stone-900 w-12 h-12 rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start gap-4 mb-2">
                  <div>
                    <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                    <div 
                      className="flex items-center gap-1 text-amber-400 text-xs cursor-pointer hover:text-amber-300"
                      onClick={() => openReviewModal(item.id, item.name)}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      <span>{getAverageRating(item.id)} ({getReviewCount(item.id)} 评价)</span>
                    </div>
                  </div>
                  <span className="font-serif font-bold text-emerald-400">{item.price}</span>
                </div>
                <p className="text-stone-400 text-sm line-clamp-2 mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tickets Section */}
      <section id="tickets" className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">门票预订</h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-lg">
            提前预订，享受更优惠的价格与更快捷的入园体验。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {TICKETS.map((ticket) => (
            <div 
              key={ticket.id} 
              className={`relative rounded-3xl p-8 ${
                ticket.id === 'vip' 
                  ? 'bg-emerald-900 text-white shadow-2xl md:-translate-y-4' 
                  : 'bg-white border border-stone-200 text-stone-900 shadow-sm'
              }`}
            >
              {ticket.id === 'vip' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  最受欢迎
                </div>
              )}
              <h3 className={`text-2xl font-serif font-bold mb-2 ${ticket.id === 'vip' ? 'text-white' : 'text-stone-900'}`}>
                {ticket.name}
              </h3>
              <p className={`text-sm mb-6 h-10 ${ticket.id === 'vip' ? 'text-emerald-200' : 'text-stone-500'}`}>
                {ticket.desc}
              </p>
              <div className="mb-8">
                <span className="text-4xl font-bold">¥{ticket.price}</span>
                <span className={`text-sm ${ticket.id === 'vip' ? 'text-emerald-200' : 'text-stone-500'}`}> /人</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {ticket.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Ticket className={`w-5 h-5 shrink-0 ${ticket.id === 'vip' ? 'text-emerald-400' : 'text-emerald-600'}`} />
                    <span className={`text-sm ${ticket.id === 'vip' ? 'text-white/90' : 'text-stone-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => handleBuyTicket(ticket)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${
                  ticket.id === 'vip'
                    ? 'bg-white text-emerald-900 hover:bg-stone-100'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                立即预订
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center flex items-center justify-center gap-2 text-stone-500 text-sm">
          <Info className="w-4 h-4" />
          <span>购票后凭身份证或电子二维码直接入园。退改签政策请参考购买须知。</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <Compass className="w-6 h-6 text-emerald-500" />
              <span className="font-serif font-bold text-xl text-white tracking-wider">云隐仙谷</span>
            </div>
            <p className="text-sm max-w-md leading-relaxed">
              致力于保护自然生态，传承在地文化。为您提供沉浸式的山水体验与高品质的旅游服务。
            </p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">快速链接</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => scrollTo('map')} className="hover:text-emerald-400">地图导览</button></li>
              <li><button onClick={() => scrollTo('guides')} className="hover:text-emerald-400">导游服务</button></li>
              <li><button onClick={() => scrollTo('food')} className="hover:text-emerald-400">美食推荐</button></li>
              <li><button onClick={() => scrollTo('tickets')} className="hover:text-emerald-400">门票预订</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-4">联系我们</h4>
            <ul className="space-y-2 text-sm">
              <li>客服热线: 400-123-4567</li>
              <li>邮箱: hello@yunyin.com</li>
              <li>地址: 云隐省仙谷市云深路1号</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-8 border-t border-stone-800 text-sm flex flex-col md:flex-row justify-between items-center">
          <p>© 2026 云隐仙谷旅游开发有限公司. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">隐私政策</a>
            <a href="#" className="hover:text-white">服务条款</a>
          </div>
        </div>
      </footer>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-stone-900">{reviewModal.targetName}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-stone-500">
                    <StarRating rating={Number(getAverageRating(reviewModal.targetId!))} />
                    <span>{getAverageRating(reviewModal.targetId!)} 分 ({getReviewCount(reviewModal.targetId!)} 评价)</span>
                  </div>
                </div>
                <button 
                  onClick={() => setReviewModal({ isOpen: false, targetId: null, targetName: '' })}
                  className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-stone-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                {/* Existing Reviews */}
                <div className="space-y-6 mb-8">
                  {reviewsData[reviewModal.targetId!]?.length > 0 ? (
                    reviewsData[reviewModal.targetId!].map((review) => (
                      <div key={review.id} className="border-b border-stone-100 pb-6 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-medium text-stone-900">{review.user}</span>
                          </div>
                          <span className="text-xs text-stone-400">{review.date}</span>
                        </div>
                        <div className="mb-2">
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="text-stone-600 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-stone-400">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>暂无评价，来做第一个评价的人吧！</p>
                    </div>
                  )}
                </div>

                {/* Write Review Form */}
                <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                  <h4 className="font-bold text-stone-900 mb-4">写下您的评价</h4>
                  <form onSubmit={submitReview}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-stone-700 mb-2">评分</label>
                      <StarRating 
                        rating={newReview.rating} 
                        setRating={(r) => setNewReview({...newReview, rating: r})} 
                        interactive 
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-stone-700 mb-2">评价内容</label>
                      <textarea 
                        rows={3}
                        className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="分享您的体验..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        required
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-emerald-700 text-white py-3 rounded-xl font-medium hover:bg-emerald-800 transition-colors"
                    >
                      提交评价
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {bookingModal.isOpen && bookingModal.guide && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              {bookingState.isSuccess ? (
                <div className="p-12 flex flex-col items-center justify-center text-center h-[500px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-6" />
                  </motion.div>
                  <h3 className="text-3xl font-serif font-bold text-stone-900 mb-2">预约成功！</h3>
                  <p className="text-stone-600 text-lg">
                    您已成功预约导游 {bookingModal.guide.name}。<br/>
                    我们已向您的手机发送确认短信，导游将尽快与您联系。
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <div className="flex items-center gap-4">
                      <img src={bookingModal.guide.image} alt={bookingModal.guide.name} className="w-12 h-12 rounded-full object-cover" />
                      <div>
                        <h3 className="text-xl font-serif font-bold text-stone-900">预约导游 - {bookingModal.guide.name}</h3>
                        <p className="text-sm text-stone-500">{bookingModal.guide.role}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setBookingModal({ isOpen: false, guide: null })}
                      className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-stone-500" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 bg-white">
                    <form onSubmit={submitBooking}>
                      {/* Calendar Section */}
                      <div className="mb-8">
                        <h4 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                          <CalendarIcon className="w-5 h-5 text-emerald-600" /> 选择日期
                        </h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
                          {next14Days.map((date, i) => {
                            const dateStr = date.toISOString().split('T')[0];
                            const isSelected = bookingState.date === dateStr;
                            // Mock some days as full
                            const isFull = i === 2 || i === 5 || i === 8; 
                            
                            return (
                              <div 
                                key={dateStr}
                                onClick={() => !isFull && setBookingState({...bookingState, date: dateStr})}
                                className={`
                                  p-3 rounded-xl border text-center cursor-pointer transition-all
                                  ${isFull ? 'bg-stone-50 border-stone-100 opacity-50 cursor-not-allowed' : 
                                    isSelected ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500' : 'bg-white border-stone-200 hover:border-emerald-300'}
                                `}
                              >
                                <div className="text-xs text-stone-500 mb-1">
                                  {['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()]}
                                </div>
                                <div className={`font-bold text-lg ${isSelected ? 'text-emerald-700' : 'text-stone-900'}`}>
                                  {date.getDate()}
                                </div>
                                <div className={`text-[10px] mt-1 ${isFull ? 'text-red-400' : 'text-emerald-600'}`}>
                                  {isFull ? '已满' : '可选'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Section */}
                      <AnimatePresence>
                        {bookingState.date && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-8 overflow-hidden"
                          >
                            <h4 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                              <Clock className="w-5 h-5 text-emerald-600" /> 选择时间段
                            </h4>
                            <div className="flex gap-4">
                              {['上午 (09:00 - 12:00)', '下午 (13:00 - 17:00)', '全天 (09:00 - 17:00)'].map(time => (
                                <div 
                                  key={time}
                                  onClick={() => setBookingState({...bookingState, time})}
                                  className={`
                                    flex-1 p-4 rounded-xl border text-center cursor-pointer transition-all text-sm font-medium
                                    ${bookingState.time === time ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-stone-200 text-stone-600 hover:border-emerald-300'}
                                  `}
                                >
                                  {time}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Contact Info */}
                      <AnimatePresence>
                        {bookingState.time && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-8 overflow-hidden"
                          >
                            <h4 className="font-bold text-stone-900 mb-4 flex items-center gap-2">
                              <User className="w-5 h-5 text-emerald-600" /> 联系人信息
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">姓名</label>
                                <input 
                                  type="text" 
                                  required
                                  className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                  placeholder="您的姓名"
                                  value={bookingState.name}
                                  onChange={e => setBookingState({...bookingState, name: e.target.value})}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-stone-700 mb-2">手机号码</label>
                                <input 
                                  type="tel" 
                                  required
                                  className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                  placeholder="您的手机号码"
                                  value={bookingState.phone}
                                  onChange={e => setBookingState({...bookingState, phone: e.target.value})}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="pt-6 border-t border-stone-100 flex justify-end gap-4">
                        <button 
                          type="button"
                          onClick={() => setBookingModal({ isOpen: false, guide: null })}
                          className="px-6 py-3 rounded-xl font-medium text-stone-600 hover:bg-stone-100 transition-colors"
                        >
                          取消
                        </button>
                        <button 
                          type="submit"
                          disabled={!bookingState.date || !bookingState.time || !bookingState.name || !bookingState.phone}
                          className="px-8 py-3 rounded-xl font-medium bg-emerald-700 text-white hover:bg-emerald-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          确认预约
                        </button>
                      </div>
                    </form>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {authModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-8 relative"
            >
              <button 
                onClick={() => setAuthModal({ ...authModal, isOpen: false })}
                className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-stone-500" />
              </button>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">
                  {authModal.isLogin ? '欢迎回来' : '注册账号'}
                </h3>
                <p className="text-stone-500 text-sm">
                  {authModal.isLogin ? '登录以管理您的门票和预约' : '创建账号开启仙谷之旅'}
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authModal.error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
                    {authModal.error}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">邮箱</label>
                  <input 
                    type="email" 
                    required
                    className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="your@email.com"
                    value={authModal.email}
                    onChange={e => setAuthModal({...authModal, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">密码</label>
                  <input 
                    type="password" 
                    required
                    className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    placeholder="••••••••"
                    value={authModal.password}
                    onChange={e => setAuthModal({...authModal, password: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full py-3 mt-4 bg-emerald-700 text-white rounded-xl font-medium hover:bg-emerald-800 transition-colors"
                >
                  {authModal.isLogin ? '登录' : '注册'}
                </button>
              </form>

              <div className="mt-6 text-center text-sm text-stone-500">
                {authModal.isLogin ? '还没有账号？' : '已有账号？'}
                <button 
                  onClick={() => setAuthModal({...authModal, isLogin: !authModal.isLogin})}
                  className="text-emerald-700 font-medium ml-1 hover:underline"
                >
                  {authModal.isLogin ? '立即注册' : '直接登录'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {paymentModal.isOpen && paymentModal.ticket && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative"
            >
              {paymentModal.isSuccess ? (
                <div className="p-12 flex flex-col items-center justify-center text-center h-[400px]">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                  >
                    <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-6" />
                  </motion.div>
                  <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">支付成功！</h3>
                  <p className="text-stone-600">
                    您的门票已存入票夹，凭二维码即可入园。
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                    <h3 className="text-xl font-serif font-bold text-stone-900">确认订单</h3>
                    <button 
                      onClick={() => setPaymentModal({ ...paymentModal, isOpen: false, ticket: null })}
                      className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-stone-500" />
                    </button>
                  </div>
                  
                  <div className="p-6">
                    <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-emerald-900">{paymentModal.ticket.name}</h4>
                        <span className="font-bold text-emerald-700">¥{paymentModal.ticket.price}</span>
                      </div>
                      <p className="text-sm text-emerald-700/80">{paymentModal.ticket.desc}</p>
                    </div>

                    <div className="text-center mb-6">
                      <p className="text-sm text-stone-500 mb-4">请扫描下方二维码完成支付</p>
                      <div className="relative inline-block border-2 border-dashed border-stone-300 rounded-2xl p-2 group">
                        <img 
                          src={paymentModal.paymentImage} 
                          alt="支付二维码" 
                          className="w-48 h-48 object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-white text-stone-900 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" /> 上传支付码
                          </button>
                          <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*"
                            onChange={handlePaymentImageUpload}
                          />
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={handlePaymentSubmit}
                      className="w-full py-4 bg-emerald-700 text-white rounded-xl font-medium hover:bg-emerald-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" /> 我已完成支付
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {profileModalOpen && currentUser && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-50 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-stone-900">我的票夹</h3>
                    <p className="text-xs text-stone-500">{currentUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-stone-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    title="退出登录"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setProfileModalOpen(false)}
                    className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-stone-500" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                {userTickets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userTickets.map((ticket, idx) => (
                      <div key={idx} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
                        <div className="bg-emerald-900 p-4 text-white flex justify-between items-center">
                          <h4 className="font-serif font-bold">{ticket.name}</h4>
                          <Ticket className="w-5 h-5 text-emerald-300" />
                        </div>
                        <div className="p-6 flex flex-col items-center border-b border-dashed border-stone-200">
                          <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100 mb-4">
                            <QRCodeSVG value={ticket.purchase_id} size={120} level="H" />
                          </div>
                          <p className="text-xs text-stone-400 font-mono">{ticket.purchase_id}</p>
                        </div>
                        <div className="p-4 bg-stone-50 text-sm text-stone-600">
                          <div className="flex justify-between mb-1">
                            <span>购买日期</span>
                            <span className="font-medium text-stone-900">{ticket.purchase_date}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>状态</span>
                            <span className="font-medium text-emerald-600">未使用</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <Ticket className="w-16 h-16 text-stone-300 mx-auto mb-4" />
                    <h4 className="text-lg font-bold text-stone-900 mb-2">暂无门票</h4>
                    <p className="text-stone-500 mb-6">您还没有购买任何门票，快去选购吧！</p>
                    <button 
                      onClick={() => { setProfileModalOpen(false); scrollTo('tickets'); }}
                      className="px-6 py-2 bg-emerald-700 text-white rounded-full font-medium hover:bg-emerald-800 transition-colors"
                    >
                      前往购票
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
