import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Torus, Text, Environment, ContactShadows, Sphere } from '@react-three/drei';
import { Input, Button, Rate, DatePicker, Slider, Modal, Row, Col, Card, Typography, Avatar, Space, Divider, Collapse } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Mail, 
  Search,
  CheckCircle2,
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Gem,
  HeartHandshake,
  Star as StarIcon,
  Users
} from 'lucide-react';
import { GoogleOutlined, FacebookFilled, InstagramFilled } from '@ant-design/icons';
import 'antd/dist/reset.css';
import logoImg from './assets/Ddreamer-Jewelry-Ddreamer-Studio-1.png';

const { Title, Paragraph, Text: AntText } = Typography;

// ==========================================
// DATA & MOCK TIME
// ==========================================
const reviewsData = [
  { id: 1, name: "Chloe G.", date: "2 weeks ago", avatar: "https://i.pravatar.cc/150?img=1", content: "A truly aesthetic and meaningful experience! My boyfriend and I made our anniversary rings here. The studio vibe is immaculate.", rating: 5 },
  { id: 2, name: "Ethan S.", date: "1 month ago", avatar: "https://i.pravatar.cc/150?img=11", content: "I was worried about messing up, but the silversmiths guided us perfectly. The engraving looks incredibly sharp. 10/10 recommend!", rating: 5 },
  { id: 3, name: "Sophia L.", date: "2 months ago", avatar: "https://i.pravatar.cc/150?img=5", content: "Worth every penny. Sawing, filing, and polishing the ring yourself gives you such a sense of accomplishment. A must-do in Saigon.", rating: 5 }
];

const showcaseImages = Array.from({ length: 8 }, (_, i) => `https://ddreamerjewelry.com/wp-content/uploads/2025/11/Ddreamer-Jewelry-Creative-Jewelry-done-by-our-customers-0${i + 1}.webp`);

const faqItems = [
  { key: '1', label: <AntText strong style={{ fontSize: '1.1rem', color: '#444', fontFamily: 'Lato, sans-serif' }}>I have zero experience. Can I really make a ring?</AntText>, children: <Paragraph style={{ fontSize: '1.05rem', color: '#666', margin: 0, fontFamily: 'Lato, sans-serif' }}>Absolutely! 95% of our guests are complete beginners. Our expert silversmiths will guide you step-by-step. We promise you won't leave until your ring looks stunning.</Paragraph> },
  { key: '2', label: <AntText strong style={{ fontSize: '1.1rem', color: '#444', fontFamily: 'Lato, sans-serif' }}>Will the jewelry tarnish or fade?</AntText>, children: <Paragraph style={{ fontSize: '1.05rem', color: '#666', margin: 0, fontFamily: 'Lato, sans-serif' }}>We use only premium, ethically sourced 925 Sterling Silver. While all silver naturally oxidizes over time, we provide you with a polishing cloth and lifetime care instructions to keep it shining forever.</Paragraph> },
  { key: '3', label: <AntText strong style={{ fontSize: '1.1rem', color: '#444', fontFamily: 'Lato, sans-serif' }}>Is this a good idea for a couple's date?</AntText>, children: <Paragraph style={{ fontSize: '1.05rem', color: '#666', margin: 0, fontFamily: 'Lato, sans-serif' }}>It's the ultimate date idea! Many couples come here to craft promise rings or anniversary gifts for each other. It's a highly interactive, intimate, and meaningful way to spend time together.</Paragraph> }
];

const journeyTimes = {
  classic: { design: '15 mins', craft: '2 hours', polish: '15 mins', total: '2 hours 30 mins' },
  flat: { design: '15 mins', craft: '1.5 hours', polish: '15 mins', total: '2 hours' },
  thick: { design: '15 mins', craft: '2.5 hours', polish: '15 mins', total: '3 hours' },
  hammered: { design: '15 mins', craft: '2.5 hours', polish: '20 mins', total: '3 hours 05 mins' }, 
  gemstone: { design: '20 mins', craft: '3 hours', polish: '20 mins', total: '3 hours 40 mins' }, 
  star: { design: '20 mins', craft: '3 hours', polish: '20 mins', total: '3 hours 40 mins' }
};

// ==========================================
// HIỆU ỨNG BẮN PHÁO HOA TOÀN MÀN HÌNH
// ==========================================
const Fireworks = () => {
  const particles = Array.from({ length: 100 }); 
  const colors = ['#e69a9d', '#f06292', '#ffd700', '#69c0ff', '#b37feb', '#ff9c6e', '#52c41a'];
  
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 99999, overflow: 'hidden' }}>
      <motion.div initial={{ bottom: -100, left: -50, scale: 0.5, rotate: 45 }} animate={{ bottom: 150, left: 150, scale: 4, rotate: 10 }} transition={{ type: "spring", stiffness: 60, duration: 1.2 }} style={{ position: 'absolute', fontSize: '4rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}>🎉</motion.div>
      <motion.div initial={{ bottom: -100, right: -50, scale: 0.5, rotate: -45 }} animate={{ bottom: 150, right: 150, scale: 4, rotate: -10 }} transition={{ type: "spring", stiffness: 60, duration: 1.2, delay: 0.1 }} style={{ position: 'absolute', fontSize: '4rem', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}>🎊</motion.div>
      {particles.map((_, i) => {
        const destinationX = (Math.random() - 0.5) * 350; 
        const destinationY = (Math.random() - 0.5) * 300 - 50; 
        const size = Math.random() * 16 + 6;
        return (
          <motion.div
            key={i} initial={{ top: '80%', left: '50%', opacity: 1, scale: 0 }}
            animate={{ top: `calc(80% + ${destinationY}vh)`, left: `calc(50% + ${destinationX}vw)`, opacity: [1, 1, 0], scale: [0, 1, 0.5], rotate: Math.random() * 720 }}
            transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
            style={{ position: 'absolute', width: `${size}px`, height: `${size}px`, backgroundColor: colors[Math.floor(Math.random() * colors.length)], borderRadius: Math.random() > 0.5 ? '50%' : '4px' }}
          />
        );
      })}
    </div>
  );
};

// ==========================================
// 3D COMPONENTS (CẬP NHẬT CÁC MẪU WORKSHOP MỚI NHẤT)
// ==========================================
const CurvedEngraving = ({ text, material, finish, positionType, fontSize, ringStyle }) => {
  const getTextColor = () => {
    if (finish === 'smooth') return material === 'gold' ? '#FFFDD0' : '#FFFFFF';
    return material === 'gold' ? '#2d1a00' : '#1a1a1a'; 
  };

  const characters = useMemo(() => {
    if (!text) return [];
    const letters = text.split('');
    const spacing = fontSize * 0.9; 
    const radius = 1; 
    const isInside = positionType === 'inside';
    
    let tubeRadius = 0.045;
    if (ringStyle === 'thick') tubeRadius = 0.08;
    if (ringStyle === 'flat') tubeRadius = 0.055;
    if (ringStyle === 'hammered') tubeRadius = 0.045;
    if (ringStyle === 'gemstone') tubeRadius = 0.05;
    if (ringStyle === 'star') tubeRadius = 0.05;

    const distance = isInside ? (radius - tubeRadius - 0.001) : (radius + tubeRadius + 0.001); 
    const arcSpacing = spacing / distance; 
    const direction = isInside ? -1 : 1;
    const totalArc = (letters.length - 1) * arcSpacing;
    
    // Với nhẫn có mặt to ở trên, khắc chữ nằm ở cạnh bên hoặc dưới
    const startAngle = (ringStyle === 'gemstone' || ringStyle === 'star') && !isInside 
      ? (Math.PI) - direction * (totalArc / 2) 
      : (3 * Math.PI / 2) - direction * (totalArc / 2); 

    return letters.map((char, index) => {
      const u = startAngle + direction * (index * arcSpacing);
      return {
        char, key: `${char}-${index}`, groupRotation: [0, 0, u], textPosition: [distance, 0, 0], textRotation: [Math.PI / 2, isInside ? -Math.PI / 2 : Math.PI / 2, 0],
      };
    });
  }, [text, positionType, fontSize, ringStyle]);

  if (!text) return null;

  return (
    <group>
      {characters.map(({ char, key, groupRotation, textPosition, textRotation }) => (
        <group key={key} rotation={groupRotation}>
          <Text position={textPosition} rotation={textRotation} fontSize={fontSize} color={getTextColor()} anchorX="center" anchorY="middle" depthOffset={-2} material-toneMapped={false}>
            <meshStandardMaterial attach="material" roughness={1} metalness={0} color={getTextColor()} />
            {char}
          </Text>
        </group>
      ))}
    </group>
  );
};

const Ring = ({ engravingText, material, finish, positionType, fontSize, ringStyle }) => {
  const materialProps = { silver: { color: '#e6e8fa' }, gold: { color: '#ffd700' } };
  const finishProps = { smooth: { roughness: 0.12, metalness: 1, clearcoat: 0.3 }, matte: { roughness: 0.35, metalness: 0.85, clearcoat: 0.05 } };

  // Tạo hình 2D cho ngôi sao
  const starShape = useMemo(() => {
    const shape = new THREE.Shape();
    const outerRadius = 0.35;
    const innerRadius = 0.15;
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const a = (i / 10) * Math.PI * 2 + Math.PI / 2;
      if (i === 0) shape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else shape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    return shape;
  }, []);

const renderGeometry = () => {
    const baseMat = <meshPhysicalMaterial {...materialProps[material]} {...finishProps[finish]} />;
    const hammeredMat = <meshPhysicalMaterial {...materialProps[material]} {...finishProps[finish]} flatShading={true} />;
    
    // Đá Opal/Gemstone phản quang
    const gemMat = <meshPhysicalMaterial color={material === 'gold' ? '#ffffff' : '#f8e8e8'} transmission={0.6} opacity={1} transparent roughness={0.1} ior={1.5} iridescence={1} iridescenceIOR={1.5} clearcoat={1} />;

    switch (ringStyle) {
      case 'flat':
        return <Torus args={[1, 0.05, 4, 128]} scale={[1, 1, 6]}>{baseMat}</Torus>;
      case 'thick':
        return <Torus args={[1, 0.08, 64, 128]} scale={[1, 1, 8]}>{baseMat}</Torus>;
      case 'hammered':
        // Vân búa: Giảm số mặt (segments) và dùng flatShading để tạo các mặt gò búa
        return <Torus args={[1, 0.045, 8, 24]} scale={[1, 1, 8]}>{hammeredMat}</Torus>;
      case 'gemstone':
        // Nhẫn gắn đá Opal/Diamond
        return (
          <group>
            <Torus args={[1, 0.045, 64, 128]} scale={[1, 1, 8]}>{baseMat}</Torus>
            {/* Chấu giữ đá: Đẩy lên Y=1.05 để nằm trên bề mặt */}
            <mesh position={[0, 1.05, 0]}><cylinderGeometry args={[0.2, 0.15, 0.15, 32]} />{baseMat}</mesh>
            {/* Viên đá: Đẩy lên Y=1.2 để nổi hẳn lên trên chấu */}
            <mesh position={[0, 1.3, 0]}><sphereGeometry args={[0.25, 32, 32]} />{gemMat}</mesh>
          </group>
        );
      case 'star':
        // Nhẫn mặt ngôi sao
        return (
          <group>
            <Torus args={[1, 0.045, 64, 128]} scale={[1, 1, 8]}>{baseMat}</Torus>
            {/* Chấu giữ: Đẩy lên Y=1.05 */}
            <mesh position={[0, 1.05, 0]}><cylinderGeometry args={[0.15, 0.1, 0.15, 32]} />{baseMat}</mesh>
            {/* Hình ngôi sao: Đẩy lên Y=1.15 để tránh phần thừa đâm ngược vào trong */}
            <mesh position={[0, 1.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <extrudeGeometry args={[starShape, { depth: 0.1, bevelEnabled: true, bevelSegments: 2, steps: 2, bevelSize: 0.02, bevelThickness: 0.02 }]} />
              {baseMat}
            </mesh>
          </group>
        );
      case 'slim':
        return <Torus args={[1, 0.02, 64, 128]} scale={[1, 1, 8]}>{baseMat}</Torus>;
      case 'classic':
      default:
        return <Torus args={[1, 0.045, 64, 128]} scale={[1, 1, 8]}>{baseMat}</Torus>;
    }
  };

  return (
    <group rotation={ringStyle === 'flat' ? [-Math.PI / 2, 0, Math.PI / 4] : [-Math.PI / 2, 0, 0]}>
      {renderGeometry()}
      <group rotation={ringStyle === 'flat' ? [0, 0, -Math.PI / 4] : [0, 0, 0]}>
        <CurvedEngraving text={engravingText} material={material} finish={finish} positionType={positionType} fontSize={fontSize} ringStyle={ringStyle} />
      </group>
    </group>
  );
};

// ==========================================
// HEADER
// ==========================================
const StickyHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: isScrolled ? 10 : 0, left: isScrolled ? '2%' : 0, right: isScrolled ? '2%' : 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.9)' : '#ffffff',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        boxShadow: isScrolled ? '0 10px 40px rgba(0,0,0,0.05)' : 'none',
        borderRadius: isScrolled ? '24px' : '0px',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '15px 40px', border: isScrolled ? '1px solid rgba(255, 255, 255, 0.5)' : 'none'
      }}
    >
      <img src={logoImg} alt="Ddreamer" style={{ height: '45px', width: 'auto', cursor: 'pointer' }} />
      <nav style={{ display: 'none', md: 'block' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '40px', fontFamily: 'Lato, sans-serif' }}>
          {['Home', 'Workshops', 'Bespoke Jewelry', 'Shop', 'About Us', 'Contact Us'].map((item, i) => (
            <li key={i}>
              <a href={`#${item.toLowerCase()}`} style={{ textDecoration: 'none', color: item === 'Workshops' ? '#e69a9d' : '#444', fontSize: '1em', fontWeight: item === 'Workshops' ? '700' : '500', letterSpacing: '0.5px', transition: 'color 0.3s' }}>
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Space size="middle" style={{ color: '#444' }}>
        <FacebookFilled style={{ fontSize: '18px', cursor: 'pointer' }} />
        <InstagramFilled style={{ fontSize: '18px', cursor: 'pointer' }} />
        <MessageCircle size={18} cursor="pointer" />
        <Divider type="vertical" />
        <Search size={20} cursor="pointer" />
      </Space>
    </motion.header>
  );
};

// ==========================================
// FOOTER
// ==========================================
const Footer = () => (
  <footer style={{ background: '#1a1a1a', color: '#f8f8f8', padding: '80px 40px 40px', textAlign: 'center', fontFamily: 'Lato, sans-serif' }}>
    <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'left' }}>
      <div>
        <img src={logoImg} alt="Ddreamer" style={{ height: '45px', width: 'auto', marginBottom: '20px', filter: 'brightness(0) invert(1)' }} />
        <p style={{ fontSize: '0.95em', lineHeight: '1.8', color: '#aaa' }}>Crafting dreams into reality, one masterpiece at a time. Experience the art of silversmithing with Ddreamer in the heart of Saigon.</p>
      </div>
      <div>
        <h4 style={{ color: '#e69a9d', fontSize: '1.2em', marginBottom: '20px', letterSpacing: '1px', fontFamily: 'Playfair Display, serif' }}>QUICK LINKS</h4>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2' }}>
          <li><a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Our Workshops</a></li>
          <li><a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Bespoke Collections</a></li>
          <li><a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Jewelry Care</a></li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: '#e69a9d', fontSize: '1.2em', marginBottom: '20px', letterSpacing: '1px', fontFamily: 'Playfair Display, serif' }}>CONNECT</h4>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2' }}>
          <li><a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Instagram @ddreamer</a></li>
          <li><a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Facebook.com/ddreamer</a></li>
          <li><a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>hello@ddreamer.com</a></li>
        </ul>
      </div>
    </div>
    <div style={{ borderTop: '1px solid #333', marginTop: '60px', paddingTop: '30px', fontSize: '0.85em', color: '#666', letterSpacing: '1px' }}>
      © {new Date().getFullYear()} DDREAMER STUDIO. ALL RIGHTS RESERVED.
    </div>
  </footer>
);

// ==========================================
// MAIN APP 
// ==========================================
export default function App() {
  const [engravingText, setEngravingText] = useState('Ddreamer');
  const [material, setMaterial] = useState('silver');
  const [finish, setFinish] = useState('smooth');
  const [engravePosition, setEngravePosition] = useState('outside');
  const [ringStyle, setRingStyle] = useState('classic');
  const [fontSize, setFontSize] = useState(0.12); 
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  
  const showcaseRef = useRef(null);

  const disabledDate = (current) => current.date() % 5 === 0 || current.date() % 7 === 0;
  const timeSlots = ['09:30 AM', '02:00 PM', '06:00 PM'];
  const SOLD_OUT_SLOT = '02:00 PM';
  const isTimeSlotSoldOut = (time) => selectedDate && time === SOLD_OUT_SLOT;

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleConfirmBooking = () => {
    setIsModalOpen(true);
    setShowFireworks(false);
  };

  const handleAddToCalendar = () => {
    setShowFireworks(true);
    setTimeout(() => {
      setShowFireworks(false);
      setIsModalOpen(false);
    }, 2800); 
  };

  const scrollShowcase = (direction) => {
    if (showcaseRef.current) {
      const scrollAmount = 400; 
      const currentScroll = showcaseRef.current.scrollLeft;
      showcaseRef.current.scrollTo({ left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount, behavior: 'smooth' });
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const renderOptionButton = (value, currentValue, setter, label) => {
    const isActive = value === currentValue;
    return (
      <div 
        onClick={() => setter(value)}
        style={{
          flex: 1, padding: '10px 4px', textAlign: 'center', borderRadius: '8px', cursor: 'pointer',
          fontFamily: 'Lato, sans-serif', fontWeight: isActive ? '700' : '500', fontSize: '0.9rem', transition: 'all 0.3s ease',
          backgroundColor: isActive ? '#FDF2F8' : '#ffffff', color: isActive ? '#880e4f' : '#666666', border: isActive ? '1px solid #e69a9d' : '1px solid #dddddd',
          boxShadow: isActive ? '0 4px 12px rgba(230, 154, 157, 0.2)' : 'none'
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', fontFamily: '"Playfair Display", serif', overflowX: 'hidden' }}>
      <StickyHeader />
      
      <AnimatePresence>
        {showFireworks && <Fireworks />}
      </AnimatePresence>
      
      {/* HERO SECTION */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={sectionVariants}
        style={{ padding: '160px 3% 80px', maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '40px' }}
      >
        <div style={{ flex: '1 1 600px' }}>
          <Title style={{ fontSize: '4.8rem', fontFamily: 'inherit', lineHeight: '1.1', marginBottom: '20px', color: '#2c2c2c' }}>
            Every piece <br/> starts with a <br/><span style={{ color: '#e69a9d', fontStyle: 'italic' }}>journey</span>
          </Title>
          <Paragraph style={{ fontSize: '1.4rem', color: '#555', lineHeight: '1.8', marginBottom: '40px', maxWidth: '550px', fontFamily: 'inherit' }}>
            Step into our <strong style={{ color: '#e69a9d' }}>Silver Jewelry Workshop</strong> in Ho Chi Minh City, where <strong style={{ color: '#880e4f' }}>unforgettable memories</strong> are made and creative experiences are crafted.
          </Paragraph>
          <Space size="large" wrap>
            <Button 
              type="primary" size="large" onClick={() => document.getElementById('configurator-section').scrollIntoView({ behavior: 'smooth' })}
              style={{ background: 'linear-gradient(135deg, #e69a9d 0%, #f06292 100%)', color: '#fff', border: 'none', height: '56px', padding: '0 40px', fontSize: '1.2rem', borderRadius: '28px', fontWeight: '600', boxShadow: '0 10px 25px rgba(230, 154, 157, 0.4)', fontFamily: 'inherit' }}
            >
              Start Designing
            </Button>
            <Button 
              size="large" icon={<Users size={18} />}
              style={{ background: '#fff', color: '#880e4f', border: '2px solid #e69a9d', height: '56px', padding: '0 30px', fontSize: '1.1rem', borderRadius: '28px', fontWeight: '600', boxShadow: '0 10px 25px rgba(230, 154, 157, 0.1)', fontFamily: 'inherit' }}
            >
              Join Community
            </Button>
          </Space>
        </div>
        
        <div style={{ flex: '1 1 450px', display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <motion.video 
            src="https://ddreamerjewelry.com/wp-content/uploads/2024/04/Ddreamer-Workshop-Tiktok-01.mp4" 
            autoPlay loop muted playsInline 
            style={{ width: '100%', maxWidth: '360px', borderRadius: '24px', transform: 'rotate(3deg)', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', border: '8px solid #fff' }} 
          />
          <div style={{ position: 'absolute', bottom: '-20px', right: '10%', fontSize: '4rem', transform: 'rotate(-15deg)' }}>✨</div>
        </div>
      </motion.section>

      <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '24px 5%', marginBottom: '60px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
          <Space align="center"><ShieldCheck color="#e69a9d" size={28} /><AntText strong style={{ color: '#555', fontSize: '1.1rem', fontFamily: 'inherit' }}>10+ Years of Craftsmanship</AntText></Space>
          <Space align="center"><StarIcon color="#e69a9d" fill="#e69a9d" size={28} /><AntText strong style={{ color: '#555', fontSize: '1.1rem', fontFamily: 'inherit' }}>5.0★ on Google Reviews</AntText></Space>
          <Space align="center"><Gem color="#e69a9d" size={28} /><AntText strong style={{ color: '#555', fontSize: '1.1rem', fontFamily: 'inherit' }}>Premium 925 Silver & Gold</AntText></Space>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3D CONFIGURATOR VÀ BOOKING NẰM CHUNG MÀN HÌNH (GOM GỌN HOÀN TOÀN) */}
      {/* ========================================== */}
      <motion.section
        id="configurator-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={sectionVariants}
        style={{ maxWidth: '1400px', margin: '0 auto 100px auto', padding: '0 3%' }}
      >
        <div style={{ background: '#fff', borderRadius: '32px', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.04)', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'stretch' }}>
          
          {/* CỘT TRÁI (3D & Hành trình) */}
          <div style={{ flex: '1.5 1 450px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ flex: 1, minHeight: '350px', background: 'linear-gradient(to bottom right, #fcfcfc, #FDF2F8)', borderRadius: '24px', overflow: 'hidden', position: 'relative', border: '1px solid #f0f0f0' }}>
              <Canvas camera={{ position: [0, 3, 6], fov: 45 }}>
                <Environment preset="studio" />
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 5]} intensity={1.5} />
                <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={1.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
                <Ring engravingText={engravingText} material={material} finish={finish} positionType={engravePosition} fontSize={fontSize} ringStyle={ringStyle} />
                <ContactShadows opacity={0.25} scale={10} blur={3} far={10} color="#000000" position={[0, -0.8, 0]} />
              </Canvas>
            </div>

            <div style={{ background: '#fafafa', padding: '16px', borderRadius: '20px', border: '1px dashed #e69a9d' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <Title level={5} style={{ margin: 0, fontFamily: 'inherit', color: '#880e4f' }}>The Journey of Your Ring</Title>
                <div style={{ background: '#FDF2F8', padding: '4px 12px', borderRadius: '16px', color: '#880e4f', fontWeight: 'bold', fontSize: '0.85rem', fontFamily: 'Lato' }}>
                  Total: {journeyTimes[ringStyle].total}
                </div>
              </div>
              <Row gutter={16}>
                <Col span={8}><AntText strong style={{ color: '#555', fontFamily: 'inherit', fontSize: '0.85rem' }}>1. Design</AntText><br/><AntText type="secondary" style={{fontSize: '0.8rem'}}>{journeyTimes[ringStyle].design}</AntText></Col>
                <Col span={8}><AntText strong style={{ color: '#e69a9d', fontFamily: 'inherit', fontSize: '0.85rem' }}>2. Craft</AntText><br/><AntText type="secondary" style={{fontSize: '0.8rem'}}>{journeyTimes[ringStyle].craft}</AntText></Col>
                <Col span={8}><AntText strong style={{ color: '#555', fontFamily: 'inherit', fontSize: '0.85rem' }}>3. Polish</AntText><br/><AntText type="secondary" style={{fontSize: '0.8rem'}}>{journeyTimes[ringStyle].polish}</AntText></Col>
              </Row>
            </div>
          </div>

          {/* CỘT PHẢI (Options & Booking GOM GỌN CHUNG 1 KHUNG) */}
          <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column' }}>
            <Title level={2} style={{ fontSize: '1.8rem', margin: '0 0 16px 0', color: '#2c2c2c', fontFamily: 'Playfair Display, serif' }}>
              Made by <span style={{ color: '#e69a9d', fontStyle: 'italic' }}>You</span>, Meant for <span style={{ color: '#880e4f', fontStyle: 'italic' }}>You</span>
            </Title>

            <div style={{ marginBottom: '12px' }}>
              <AntText strong style={{ display: 'block', marginBottom: '6px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', fontFamily: 'Lato' }}>Ring Style</AntText>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                {renderOptionButton('classic', ringStyle, setRingStyle, 'Classic')}
                {renderOptionButton('flat', ringStyle, setRingStyle, 'Flat Edge')}
                {renderOptionButton('thick', ringStyle, setRingStyle, 'Chunky')}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {renderOptionButton('hammered', ringStyle, setRingStyle, 'Hammered')}
                {renderOptionButton('gemstone', ringStyle, setRingStyle, 'Gemstone')}
                {renderOptionButton('star', ringStyle, setRingStyle, 'Star')}
              </div>
            </div>

            <Row gutter={12} style={{ marginBottom: '12px' }}>
              <Col span={12}>
                <AntText strong style={{ display: 'block', marginBottom: '6px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', fontFamily: 'Lato' }}>Material</AntText>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {renderOptionButton('silver', material, setMaterial, 'Silver')}
                  {renderOptionButton('gold', material, setMaterial, 'Gold')}
                </div>
              </Col>
              <Col span={12}>
                <AntText strong style={{ display: 'block', marginBottom: '6px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', fontFamily: 'Lato' }}>Finish</AntText>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {renderOptionButton('smooth', finish, setFinish, 'Smooth')}
                  {renderOptionButton('matte', finish, setFinish, 'Matte')}
                </div>
              </Col>
            </Row>

            <Row gutter={12} style={{ marginBottom: '12px' }}>
              <Col span={12}>
                <AntText strong style={{ display: 'block', marginBottom: '6px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', fontFamily: 'Lato' }}>Engraving Position</AntText>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {renderOptionButton('outside', engravePosition, setEngravePosition, 'Outer')}
                  {renderOptionButton('inside', engravePosition, setEngravePosition, 'Inner')}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <AntText strong style={{ color: '#888', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', fontFamily: 'Lato' }}>Text Size</AntText>
                  <AntText strong style={{ color: '#e69a9d', fontSize: '0.8rem' }}>{Math.round(fontSize * 100)}</AntText>
                </div>
                <Slider min={0.06} max={0.28} step={0.01} value={fontSize} onChange={setFontSize} trackStyle={{ backgroundColor: '#e69a9d' }} handleStyle={{ borderColor: '#e69a9d' }} style={{ margin: '8px 0' }} />
              </Col>
            </Row>

            <div style={{ marginBottom: '16px' }}>
              <Input placeholder="Type your message to engrave..." value={engravingText} onChange={(e) => setEngravingText(e.target.value)} style={{ borderRadius: '8px', padding: '8px 12px', fontSize: '1rem', backgroundColor: '#fafafa', border: '1px solid #ddd', fontFamily: 'inherit' }} maxLength={20} />
            </div>

            <Divider style={{ margin: '8px 0 16px 0' }} />

            {/* FORM ĐẶT LỊCH NẰM GỌN BÊN DƯỚI, KHÔNG CẦN CUỘN THÊM */}
            <Row gutter={12} style={{ marginBottom: '16px' }}>
              <Col span={9}>
                <AntText strong style={{ display: 'block', marginBottom: '6px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', fontFamily: 'Lato' }}>Select Date</AntText>
                <DatePicker onChange={handleDateChange} disabledDate={disabledDate} style={{ width: '100%', height: '38px', borderRadius: '8px', border: '1px solid #ddd', fontFamily: 'Lato' }} placeholder="Pick Date" />
              </Col>
              <Col span={15}>
                <AntText strong style={{ display: 'block', marginBottom: '6px', color: '#888', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.75rem', fontFamily: 'Lato' }}>Select Time</AntText>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {timeSlots.map((time) => {
                    const soldOut = isTimeSlotSoldOut(time);
                    const isSelected = selectedTime === time;
                    return (
                      <Button 
                        key={time} onClick={() => !soldOut && setSelectedTime(time)} disabled={soldOut} 
                        style={{ 
                          flex: 1, padding: 0, height: '38px', borderRadius: '8px', fontFamily: 'Lato, sans-serif', fontSize: '0.8rem',
                          background: soldOut ? '#f0f0f0' : (isSelected ? '#FDF2F8' : '#fff'), color: soldOut ? '#aaa' : (isSelected ? '#880e4f' : '#444'),         
                          borderColor: soldOut ? '#f0f0f0' : (isSelected ? '#e69a9d' : '#ddd'),
                          fontWeight: isSelected ? '700' : '500', transition: 'all 0.3s'
                        }}
                      >
                        {soldOut ? 'Full' : time.split(' ')[0]}
                      </Button>
                    );
                  })}
                </div>
              </Col>
            </Row>

            <Button 
              size="large" disabled={!selectedDate || !selectedTime} onClick={handleConfirmBooking}
              style={{ 
                marginTop: 'auto', background: (!selectedDate || !selectedTime) ? '#e0e0e0' : 'linear-gradient(135deg, #e69a9d 0%, #f06292 100%)', 
                color: (!selectedDate || !selectedTime) ? '#999' : '#fff', border: 'none', height: '54px', fontSize: '1.1rem', borderRadius: '12px', fontWeight: '700', letterSpacing: '1px', fontFamily: 'inherit',
                boxShadow: (!selectedDate || !selectedTime) ? 'none' : '0 10px 20px rgba(230, 154, 157, 0.4)'
              }}
            >
              CONFIRM BOOKING
            </Button>
          </div>

        </div>
      </motion.section>

      {/* SHOWCASE SECTION */}
      <section style={{ background: '#3c3842', padding: '100px 0', textAlign: 'center', marginBottom: '100px', position: 'relative' }}>
        <Title level={2} style={{ color: '#e69a9d', fontSize: '2.8rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px', fontFamily: 'inherit' }}>
          Creative Rings Showcase
        </Title>
        <Paragraph style={{ color: '#e0e0e0', fontSize: '1.2rem', marginBottom: '60px', fontFamily: 'Lato, sans-serif' }}>
          See the unique, bespoke rings brought to life by our community of makers.
        </Paragraph>
        
        <div style={{ position: 'relative', maxWidth: '1600px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <Button shape="circle" icon={<ChevronLeft size={24} />} onClick={() => scrollShowcase('left')} style={{ position: 'absolute', left: '2%', zIndex: 10, width: '50px', height: '50px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} />
          <div ref={showcaseRef} style={{ display: 'flex', overflowX: 'auto', gap: '30px', padding: '20px 5%', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth', width: '100%' }}>
            {showcaseImages.map((src, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.03 }} style={{ flexShrink: 0 }}>
                <img src={src} alt={`Showcase ${idx + 1}`} style={{ height: '320px', width: '320px', borderRadius: '24px', objectFit: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.05)' }} />
              </motion.div>
            ))}
          </div>
          <Button shape="circle" icon={<ChevronRight size={24} />} onClick={() => scrollShowcase('right')} style={{ position: 'absolute', right: '2%', zIndex: 10, width: '50px', height: '50px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }} />
        </div>
      </section>

      {/* FOUNDER STORY SECTION */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.4 }} variants={sectionVariants}
        style={{ padding: '0 3%', maxWidth: '1400px', margin: '0 auto 120px auto' }}
      >
        <Row gutter={[80, 40]} align="middle" justify="center">
          <Col xs={24} md={10}>
            <div style={{ position: 'relative' }}>
              <img src="https://ddreamerjewelry.com/wp-content/uploads/2023/07/Ddreamer-Jewelry-Making-workshops-Ho-Chi-Minh-City-Saigon-Vietnam-Kid-Friendly-Workshops-17.jpg" alt="Silversmith Crafting" style={{ width: '100%', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)', objectFit: 'cover' }} />
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Title level={2} style={{ fontSize: '3.5rem', marginBottom: '24px', color: '#2c2c2c', fontFamily: 'inherit' }}>
              Fostering <span style={{ color: '#e69a9d', fontStyle: 'italic' }}>Memories</span>
            </Title>
            <Paragraph style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.8', marginBottom: '20px', fontFamily: 'Lato, sans-serif' }}>
              Our workshops provide an ideal setting for couples, friends, and families to bond and create lasting memories. As you embark on this creative journey together, you share in the joy of discovery and spark deeper connections.
            </Paragraph>
            <Paragraph style={{ fontSize: '1.2rem', color: '#555', lineHeight: '1.8', fontFamily: 'Lato, sans-serif' }}>
              The jewelry pieces crafted during our sessions serve as tangible tokens of these cherished moments. Each time you wear your creation, you are reminded of the love, laughter, and support that surrounded you during your artistic endeavor.
            </Paragraph>
            <div style={{ marginTop: '50px', borderLeft: '4px solid #e69a9d', paddingLeft: '20px' }}>
              <AntText style={{ fontFamily: 'inherit', fontSize: '2rem', fontStyle: 'italic', display: 'block', color: '#111' }}>Dieu Tran</AntText>
              <AntText style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem', color: '#888', fontWeight: 'bold', fontFamily: 'Lato, sans-serif' }}>Founder & Head Silversmith</AntText>
            </div>
          </Col>
        </Row>
      </motion.section>

      {/* FAQ SECTION */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} 
        style={{ padding: '0 5%', maxWidth: '1000px', margin: '0 auto 100px auto' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <HeartHandshake size={48} color="#e69a9d" style={{ marginBottom: '16px' }} />
          <Title level={2} style={{ fontSize: '3rem', color: '#2c2c2c', fontFamily: 'inherit' }}>First Time? <span style={{ color: '#e69a9d', fontStyle: 'italic' }}>We Got You.</span></Title>
        </div>
        <Collapse accordion items={faqItems} bordered={false} style={{ background: '#fff', borderRadius: '24px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', padding: '10px' }} />
      </motion.section>

      {/* REVIEWS SECTION */}
      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={sectionVariants} 
        style={{ padding: '100px 5%', background: '#fff', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginBottom: '100px' }}
      >
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2} style={{ fontSize: '3.5rem', marginBottom: '16px', color: '#2c2c2c', fontFamily: 'inherit' }}>What Our <span style={{ color: '#e69a9d', fontStyle: 'italic' }}>Ddreamers</span> Say</Title>
            <Space align="center" style={{ fontSize: '1.2rem' }}>
              <AntText strong style={{ fontSize: '28px', fontFamily: 'Lato, sans-serif' }}>5.0</AntText>
              <Rate disabled defaultValue={5} style={{ color: '#fbbc04', fontSize: '24px' }} />
              <AntText type="secondary" style={{ marginLeft: '8px', fontFamily: 'Lato, sans-serif' }}>from 376 Google Reviews</AntText>
            </Space>
          </div>

          <Row gutter={[40, 40]} justify="center">
            {reviewsData.map((review) => (
              <Col xs={24} md={8} key={review.id}>
                <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card bordered={false} style={{ borderRadius: '24px', background: '#fafafa', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', height: '100%', padding: '20px', position: 'relative', overflow: 'visible' }}>
                    <GoogleOutlined style={{ position: 'absolute', top: 20, right: 20, color: '#4285F4', fontSize: '24px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                      <Avatar src={review.avatar} size={72} style={{ border: '4px solid #fff', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', marginTop: '-50px' }} />
                      <AntText strong style={{ marginTop: '16px', fontSize: '1.2rem', display: 'block', fontFamily: 'Lato, sans-serif' }}>{review.name}</AntText>
                      <Space size={4} style={{ marginTop: '4px' }}>
                        <Rate disabled defaultValue={review.rating} style={{ color: '#fbbc04', fontSize: '14px' }} />
                        <AntText type="secondary" style={{ fontSize: '0.85rem', marginLeft: '4px', fontFamily: 'Lato, sans-serif' }}>{review.date}</AntText>
                      </Space>
                    </div>
                    <Paragraph style={{ color: '#555', fontSize: '1.1rem', lineHeight: '1.7', textAlign: 'center', fontFamily: 'Lato, sans-serif' }}>"{review.content}"</Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </motion.section>

      {/* POPUP NẰM NGANG VÀ NÚT BÊN PHẢI */}
      <Modal
        title={null} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} width={700} centered closeIcon={false}
        styles={{ body: { padding: 0, borderRadius: '24px', overflow: 'hidden' } }}
      >
        <div style={{ background: 'linear-gradient(135deg, #e69a9d 0%, #f06292 100%)', padding: '20px 30px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '50%', marginBottom: '10px' }}>
            <Sparkles size={32} color="#fff" />
          </div>
          <Title level={3} style={{ margin: '0 0 5px 0', fontSize: '1.8rem', color: '#fff', fontFamily: 'inherit' }}>Design Saved! </Title>
          <AntText style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)', fontFamily: 'Lato' }}>We can't wait to see you at the studio.</AntText>
        </div>

        <div style={{ padding: '25px', background: '#fff' }}>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ flex: 1, background: '#FDF2F8', padding: '15px', borderRadius: '16px', border: '1px solid rgba(230, 154, 157, 0.3)', display: 'flex', alignItems: 'center' }}>
              <CalendarIcon size={20} color="#880e4f" style={{ marginRight: '10px' }} />
              <AntText style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#880e4f', fontFamily: 'Lato, sans-serif' }}>{selectedDate ? selectedDate.format('MMMM D, YYYY') : ''}</AntText>
            </div>
            <div style={{ flex: 1, background: '#FDF2F8', padding: '15px', borderRadius: '16px', border: '1px solid rgba(230, 154, 157, 0.3)', display: 'flex', alignItems: 'center' }}>
              <Clock size={20} color="#880e4f" style={{ marginRight: '10px' }} />
              <AntText style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#880e4f', fontFamily: 'Lato, sans-serif' }}>{selectedTime}</AntText>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ flex: 2, background: '#fafafa', padding: '20px', borderRadius: '20px', border: '1px solid #eee' }}>
              <Title level={5} style={{ margin: '0 0 16px 0', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem', fontFamily: 'Lato, sans-serif' }}>Your Custom Blueprint</Title>
              <Row justify="space-between" style={{ marginBottom: '10px' }}><AntText type="secondary" style={{fontFamily: 'Lato, sans-serif'}}>Ring Style</AntText><AntText strong style={{ textTransform: 'capitalize', fontFamily: 'Lato, sans-serif' }}>{ringStyle}</AntText></Row>
              <Row justify="space-between" style={{ marginBottom: '10px' }}><AntText type="secondary" style={{fontFamily: 'Lato, sans-serif'}}>Material</AntText><AntText strong style={{fontFamily: 'Lato, sans-serif'}}>{material === 'silver' ? 'Silver 925' : 'Gold-plated'}</AntText></Row>
              <Row justify="space-between" style={{ marginBottom: '10px' }}><AntText type="secondary" style={{fontFamily: 'Lato, sans-serif'}}>Finish</AntText><AntText strong style={{fontFamily: 'Lato, sans-serif'}}>{finish === 'smooth' ? 'Smooth' : 'Satin Matte'}</AntText></Row>
              <Row justify="space-between" style={{ marginBottom: '10px' }}><AntText type="secondary" style={{fontFamily: 'Lato, sans-serif'}}>Placement</AntText><AntText strong style={{fontFamily: 'Lato, sans-serif'}}>{engravePosition === 'inside' ? 'Inner Band' : 'Outer Band'}</AntText></Row>
              <Row justify="space-between"><AntText type="secondary" style={{fontFamily: 'Lato, sans-serif'}}>Engraving</AntText><AntText strong style={{ fontStyle: 'italic', color: '#e69a9d', fontFamily: 'inherit' }}>"{engravingText}"</AntText></Row>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button 
                  type="primary" size="large" 
                  onClick={handleAddToCalendar} 
                  style={{ width: '100%', background: 'linear-gradient(135deg, #e69a9d 0%, #f06292 100%)', color: '#fff', border: 'none', borderRadius: '12px', height: '60px', fontWeight: '600', fontFamily: 'Lato, sans-serif', boxShadow: '0 4px 15px rgba(230, 154, 157, 0.4)' }}
                >
                  Add to Calendar
                </Button>
              </motion.div>
              <Button size="large" onClick={() => setIsModalOpen(false)} style={{ width: '100%', borderRadius: '12px', height: '50px', background: '#f0f0f0', color: '#444', border: 'none', fontWeight: '600', fontFamily: 'Lato, sans-serif' }}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}