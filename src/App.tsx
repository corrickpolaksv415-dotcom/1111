import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Info
} from 'lucide-react';

// --- Mock Data ---
const GUIDES = [
  { id: 1, name: '林青', role: '资深文化导游', image: 'https://picsum.photos/seed/guide1/400/500', rating: 4.9, reviews: 342, tags: ['历史讲解', '幽默风趣'] },
  { id: 2, name: '张远', role: '生态探险向导', image: 'https://picsum.photos/seed/guide2/400/500', rating: 4.8, reviews: 215, tags: ['植物科普', '户外急救'] },
  { id: 3, name: '苏婉', role: '亲子游专家', image: 'https://picsum.photos/seed/guide3/400/500', rating: 5.0, reviews: 528, tags: ['耐心细致', '儿童互动'] },
];

const FOODS = [
  { id: 1, name: '云隐竹筒饭', desc: '采摘清晨翠竹，搭配高山香米与秘制腊肉。', image: 'https://picsum.photos/seed/food1/600/400', price: '¥38' },
  { id: 2, name: '仙谷桃花酿', desc: '三月桃花古法酿制，入口甘甜，回味悠长。', image: 'https://picsum.photos/seed/food2/600/400', price: '¥58' },
  { id: 3, name: '野菌土鸡汤', desc: '深山散养土鸡与珍稀野菌慢熬六小时。', image: 'https://picsum.photos/seed/food3/600/400', price: '¥128' },
  { id: 4, name: '翠玉荷花酥', desc: '传统手工糕点，形似荷花，酥脆可口。', image: 'https://picsum.photos/seed/food4/600/400', price: '¥28' },
];

const MERCH = [
  { id: 1, name: '「云深不知处」香薰蜡烛', desc: '提取谷中松柏与晨露的清香。', image: 'https://picsum.photos/seed/merch1/500/500', price: '¥88' },
  { id: 2, name: '仙谷四季明信片套盒', desc: '收录景区春夏秋冬绝美摄影作品。', image: 'https://picsum.photos/seed/merch2/500/500', price: '¥45' },
  { id: 3, name: '手工竹编茶具套装', desc: '非遗传承人纯手工编制，古朴典雅。', image: 'https://picsum.photos/seed/merch3/500/500', price: '¥299' },
  { id: 4, name: '神兽祈福御守', desc: '源自仙谷古老传说的守护符。', image: 'https://picsum.photos/seed/merch4/500/500', price: '¥35' },
];

const TICKETS = [
  { id: 'standard', name: '成人标准票', desc: '包含景区所有公共开放区域', price: 198, features: ['全天无限次进出', '免费乘坐观光车', '包含基础意外险'] },
  { id: 'child', name: '儿童/学生票', desc: '适用于1.2m-1.5m儿童及全日制学生', price: 98, features: ['全天无限次进出', '免费乘坐观光车', '需出示有效证件'] },
  { id: 'vip', name: 'VIP尊享套票', desc: '享受免排队及专属导游服务', price: 588, features: ['所有项目免排队', '专属金牌导游(4小时)', '包含一顿特色午餐', '免费VIP休息室'] },
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-stone-50 selection:bg-emerald-900 selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
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
            className="fixed inset-0 z-40 bg-white pt-24 px-6 flex flex-col gap-6 md:hidden"
          >
            <button onClick={() => scrollTo('map')} className="text-2xl font-serif text-left border-b border-stone-100 pb-4">地图导览</button>
            <button onClick={() => scrollTo('guides')} className="text-2xl font-serif text-left border-b border-stone-100 pb-4">专属导游</button>
            <button onClick={() => scrollTo('food')} className="text-2xl font-serif text-left border-b border-stone-100 pb-4">美食地图</button>
            <button onClick={() => scrollTo('merch')} className="text-2xl font-serif text-left border-b border-stone-100 pb-4">文创商品</button>
            <button onClick={() => scrollTo('tickets')} className="text-2xl font-serif text-left text-emerald-700 pb-4">门票预订</button>
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
              {/* Interactive Map Pins (Decorative) */}
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
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
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
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="font-bold text-stone-900">{guide.rating}</span>
                      <span className="text-stone-400 text-sm">({guide.reviews} 评价)</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {guide.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-3 border border-stone-200 rounded-xl text-stone-900 font-medium hover:bg-stone-50 transition-colors">
                    预约导游
                  </button>
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
            <div key={food.id} className={`group cursor-pointer ${index === 0 || index === 3 ? 'md:col-span-2 lg:col-span-2' : ''}`}>
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
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">{food.name}</h3>
              <p className="text-stone-500 text-sm line-clamp-2">{food.desc}</p>
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
              <div key={item.id} className="group">
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
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h3 className="font-medium text-lg mb-1">{item.name}</h3>
                    <p className="text-stone-400 text-sm line-clamp-2">{item.desc}</p>
                  </div>
                  <span className="font-serif font-bold text-emerald-400">{item.price}</span>
                </div>
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
          {TICKETS.map((ticket, index) => (
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
    </div>
  );
}

