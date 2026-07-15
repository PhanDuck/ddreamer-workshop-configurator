import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Torus, Text, Environment, ContactShadows } from '@react-three/drei';
import { Input, Button, Rate, DatePicker, Slider, Modal, Row, Col, Card, Typography, Avatar, Space, Divider, Collapse } from 'antd';
import { motion } from 'framer-motion';
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
  Star // <-- Đã thêm lại icon Star ở đây
} from 'lucide-react';
import { GoogleOutlined, FacebookFilled, InstagramFilled } from '@ant-design/icons';
import 'antd/dist/reset.css';
import logoImg from './assets/Ddreamer-Jewelry-Ddreamer-Studio-1.png';

const { Title, Paragraph, Text: AntText } = Typography;

// ==========================================
// DATA
// ==========================================
const reviewsData = [
  {
    id: 1,
    name: "Chloe G.",
    date: "2 weeks ago",
    avatar: "https://i.pravatar.cc/150?img=1",
    content: "A truly aesthetic and meaningful experience! My boyfriend and I made our anniversary rings here. The studio vibe is immaculate.",
    rating: 5,
  },
  {
    id: 2,
    name: "Ethan S.",
    date: "1 month ago",
    avatar: "https://i.pravatar.cc/150?img=11",
    content: "I was worried about messing up, but the silversmiths guided us perfectly. The engraving looks incredibly sharp. 10/10 recommend!",
    rating: 5,
  },
  {
    id: 3,
    name: "Sophia L.",
    date: "2 months ago",
    avatar: "https://i.pravatar.cc/150?img=5",
    content: "Worth every penny. Sawing, filing, and polishing the ring yourself gives you such a sense of accomplishment. A must-do in Saigon.",
    rating: 5,
  }
];

const showcaseImages = Array.from({ length: 8 }, (_, i) => 
  `https://ddreamerjewelry.com/wp-content/uploads/2025/11/Ddreamer-Jewelry-Creative-Jewelry-done-by-our-customers-0${i + 1}.webp`
);

const faqItems = [
  {
    key: '1',
    label: <AntText strong style={{ fontSize: '1.1rem', color: '#444' }}>I have zero experience. Can I really make a ring?</AntText>,
    children: <Paragraph style={{ fontSize: '1.05rem', color: '#666', margin: 0 }}>Absolutely! 95% of our guests are complete beginners. Our expert silversmiths will guide you step-by-step. We promise you won't leave until your ring looks stunning.</Paragraph>,
  },
  {
    key: '2',
    label: <AntText strong style={{ fontSize: '1.1rem', color: '#444' }}>Will the jewelry tarnish or fade?</AntText>,
    children: <Paragraph style={{ fontSize: '1.05rem', color: '#666', margin: 0 }}>We use only premium, ethically sourced 925 Sterling Silver. While all silver naturally oxidizes over time, we provide you with a polishing cloth and lifetime care instructions to keep it shining forever.</Paragraph>,
  },
  {
    key: '3',
    label: <AntText strong style={{ fontSize: '1.1rem', color: '#444' }}>Is this a good idea for a couple's date?</AntText>,
    children: <Paragraph style={{ fontSize: '1.05rem', color: '#666', margin: 0 }}>It's the ultimate date idea! Many couples come here to craft promise rings or anniversary gifts for each other. It's a highly interactive, intimate, and meaningful way to spend time together.</Paragraph>,
  }
];

// ==========================================
// 3D COMPONENTS 
// ==========================================
const CurvedEngraving = ({ text, material, finish, positionType, fontSize }) => {
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
    const tubeRadius = 0.045; 
    const distance = isInside ? (radius - tubeRadius - 0.001) : (radius + tubeRadius + 0.001); 
    const arcSpacing = spacing / distance; 
    const direction = isInside ? -1 : 1;
    const totalArc = (letters.length - 1) * arcSpacing;
    const startAngle = (3 * Math.PI / 2) - direction * (totalArc / 2); 

    return letters.map((char, index) => {
      const u = startAngle + direction * (index * arcSpacing);
      return {
        char,
        key: `${char}-${index}`,
        groupRotation: [0, 0, u],
        textPosition: [distance, 0, 0],
        textRotation: [Math.PI / 2, isInside ? -Math.PI / 2 : Math.PI / 2, 0],
      };
    });
  }, [text, positionType, fontSize]);

  if (!text) return null;

  return (
    <group>
      {characters.map(({ char, key, groupRotation, textPosition, textRotation }) => (
        <group key={key} rotation={groupRotation}>
          <Text
            position={textPosition}
            rotation={textRotation}
            fontSize={fontSize}
            color={getTextColor()}
            anchorX="center"
            anchorY="middle"
            depthOffset={-2}
            material-toneMapped={false}
          >
            <meshStandardMaterial attach="material" roughness={1} metalness={0} color={getTextColor()} />
            {char}
          </Text>
        </group>
      ))}
    </group>
  );
};

const Ring = ({ engravingText, material, finish, positionType, fontSize }) => {
  const materialProps = {
    silver: { color: '#e6e8fa' },
    gold: { color: '#ffd700' },
  };
  const finishProps = {
    smooth: { roughness: 0.12, metalness: 1, clearcoat: 0.3 },
    matte: { roughness: 0.35, metalness: 0.85, clearcoat: 0.05 },
  };

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <Torus args={[1, 0.045, 64, 128]} scale={[1, 1, 8]}>
        <meshPhysicalMaterial {...materialProps[material]} {...finishProps[finish]} />
      </Torus>
      <CurvedEngraving text={engravingText} material={material} finish={finish} positionType={positionType} fontSize={fontSize} />
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
        top: isScrolled ? 10 : 0,
        left: isScrolled ? '2%' : 0,
        right: isScrolled ? '2%' : 0,
        zIndex: 1000,
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.85)' : '#ffffff',
        backgroundImage: isScrolled ? 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(253,242,248,0.7) 100%)' : 'none',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        boxShadow: isScrolled ? '0 10px 40px rgba(0,0,0,0.06)' : 'none',
        borderRadius: isScrolled ? '24px' : '0px',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        border: isScrolled ? '1px solid rgba(255, 255, 255, 0.5)' : 'none'
      }}
    >
      <img src={logoImg} alt="Ddreamer" style={{ height: '45px', width: 'auto', cursor: 'pointer' }} />
      
      <nav style={{ display: 'none', md: 'block' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '40px' }}>
          {['Home', 'Workshops', 'Bespoke Jewelry', 'Shop', 'About Us', 'Contact Us'].map((item, i) => (
            <li key={i}>
              <a href={`#${item.toLowerCase()}`} style={{ 
                textDecoration: 'none', 
                color: item === 'Workshops' ? '#e69a9d' : '#444', 
                fontSize: '1em', 
                fontWeight: item === 'Workshops' ? '600' : '400',
                letterSpacing: '0.5px',
                transition: 'color 0.3s' 
              }}>
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
  <footer style={{ background: '#1a1a1a', color: '#f8f8f8', padding: '80px 40px 40px', textAlign: 'center' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', textAlign: 'left' }}>
      <div>
        <img src={logoImg} alt="Ddreamer" style={{ height: '45px', width: 'auto', marginBottom: '20px', filter: 'brightness(0) invert(1)' }} />
        <p style={{ fontSize: '0.95em', lineHeight: '1.8', color: '#aaa' }}>
          Crafting dreams into reality, one masterpiece at a time. Experience the art of silversmithing with Ddreamer in the heart of Saigon.
        </p>
      </div>
      <div>
        <h4 style={{ color: '#e69a9d', fontSize: '1.2em', marginBottom: '20px', letterSpacing: '1px' }}>QUICK LINKS</h4>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2.2' }}>
          <li><a href="#" style={{ textDecoration: 'none', color: '#ccc', transition: 'color 0.2s' }}>Our Workshops</a></li>
          <li><a href="#" style={{ textDecoration: 'none', color: '#ccc', transition: 'color 0.2s' }}>Bespoke Collections</a></li>
          <li><a href="#" style={{ textDecoration: 'none', color: '#ccc', transition: 'color 0.2s' }}>Jewelry Care</a></li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: '#e69a9d', fontSize: '1.2em', marginBottom: '20px', letterSpacing: '1px' }}>CONNECT</h4>
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
  const [fontSize, setFontSize] = useState(0.12); 
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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
  };

  const scrollShowcase = (direction) => {
    if (showcaseRef.current) {
      const scrollAmount = 400; 
      const currentScroll = showcaseRef.current.scrollLeft;
      showcaseRef.current.scrollTo({ 
        left: direction === 'left' ? currentScroll - scrollAmount : currentScroll + scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  // Helper render Custom Button (Nền hồng nhạt, chữ hồng đậm)
  const renderOptionButton = (value, currentValue, setter, label) => {
    const isActive = value === currentValue;
    return (
      <div 
        onClick={() => setter(value)}
        style={{
          flex: 1,
          padding: '12px 0',
          textAlign: 'center',
          borderRadius: '12px',
          cursor: 'pointer',
          fontWeight: isActive ? '700' : '500',
          fontSize: '1rem',
          transition: 'all 0.3s ease',
          backgroundColor: isActive ? '#FDF2F8' : '#ffffff',  
          color: isActive ? '#880e4f' : '#666666',            
          border: isActive ? '1px solid #e69a9d' : '1px solid #dddddd',
          boxShadow: isActive ? '0 4px 12px rgba(230, 154, 157, 0.2)' : 'none'
        }}
      >
        {label}
      </div>
    );
  };

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', fontFamily: 'var(--body-font)' }}>
      <StickyHeader />
      
      {/* HERO SECTION - Áp dụng Tip 2: Ấn tượng đầu tiên ngắn gọn */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
        style={{ 
          padding: '180px 5% 80px', 
          backgroundImage: 'linear-gradient(rgba(253, 242, 248, 0.85), rgba(255, 255, 255, 0.95)), url("https://images.unsplash.com/photo-1573408301145-b98c4af06b58?auto=format&fit=crop&w=1600&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', 
          textAlign: 'center'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <Title style={{ color: '#e69a9d', fontSize: '4.5rem', lineHeight: '1.15', marginBottom: '20px', textShadow: '0 2px 10px rgba(255,255,255,0.5)', fontFamily: 'var(--heading-font)' }}>
            Craft Your Story in Silver
          </Title>
          <Paragraph style={{ fontSize: '1.4rem', color: '#555', lineHeight: '1.8', marginBottom: '40px' }}>
            No prior experience needed. Join 1,000+ Ddreamers who have forged their own unforgettable memories at our Saigon workshop.
          </Paragraph>
          <Button 
            type="primary" 
            size="large"
            href="#booking-section"
            style={{ 
              background: 'linear-gradient(135deg, #e69a9d 0%, #f06292 100%)', 
              color: '#fff', border: 'none', height: '56px', padding: '0 40px', fontSize: '1.2rem', borderRadius: '28px', fontWeight: '600',
              boxShadow: '0 10px 25px rgba(230, 154, 157, 0.4)'
            }}
          >
            Start Designing
          </Button>
        </div>
      </motion.section>

      {/* Áp dụng Tip 3: Trust Signals (Tín hiệu Niềm tin) */}
      <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '20px 5%', marginBottom: '60px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px' }}>
          <Space align="center"><ShieldCheck color="#e69a9d" /><AntText strong style={{ color: '#555' }}>10+ Years of Craftsmanship</AntText></Space>
          <Space align="center"><Star color="#e69a9d" fill="#e69a9d" /><AntText strong style={{ color: '#555' }}>5.0★ on Google Reviews</AntText></Space>
          <Space align="center"><Gem color="#e69a9d" /><AntText strong style={{ color: '#555' }}>Premium 925 Silver & Gold</AntText></Space>
        </div>
      </div>

      {/* 3D CONFIGURATOR */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        style={{ maxWidth: '1200px', margin: '0 auto 100px auto', padding: '0 5%' }}
      >
        <div style={{ background: '#fff', borderRadius: '32px', padding: '40px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)', display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          
          <div style={{ flex: '1.5 1 400px', height: '600px', background: 'linear-gradient(to bottom right, #f8f9fa, #FDF2F8)', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
            <Canvas camera={{ position: [0, 3, 5], fov: 45 }}>
              <Environment preset="studio" />
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 10, 5]} intensity={1.5} />
              <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={1.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
              <Ring engravingText={engravingText} material={material} finish={finish} positionType={engravePosition} fontSize={fontSize} />
              <ContactShadows opacity={0.2} scale={10} blur={3} far={10} color="#000000" position={[0, -0.6, 0]} />
            </Canvas>
          </div>

          <div style={{ flex: '1 1 350px', padding: '20px 0' }}>
            <Title level={2} style={{ fontSize: '2.2rem', marginBottom: '30px' }}>Craft Your Vision</Title>

            <div style={{ marginBottom: '24px' }}>
              <AntText strong style={{ display: 'block', marginBottom: '12px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Material</AntText>
              <div style={{ display: 'flex', gap: '12px' }}>
                {renderOptionButton('silver', material, setMaterial, 'Silver 925')}
                {renderOptionButton('gold', material, setMaterial, 'Gold-plated')}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <AntText strong style={{ display: 'block', marginBottom: '12px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Finish</AntText>
              <div style={{ display: 'flex', gap: '12px' }}>
                {renderOptionButton('smooth', finish, setFinish, 'Smooth')}
                {renderOptionButton('matte', finish, setFinish, 'Satin Matte')}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <AntText strong style={{ display: 'block', marginBottom: '12px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Engraving Position</AntText>
              <div style={{ display: 'flex', gap: '12px' }}>
                {renderOptionButton('outside', engravePosition, setEngravePosition, 'Outer Band')}
                {renderOptionButton('inside', engravePosition, setEngravePosition, 'Inner Band')}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <AntText strong style={{ display: 'block', marginBottom: '12px', color: '#666', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Personalized Message</AntText>
              <Input
                placeholder="Type your message..."
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                style={{ borderRadius: '12px', padding: '12px 16px', fontSize: '1.1rem', backgroundColor: '#f9f9f9', border: '1px solid #ddd' }}
                maxLength={20}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <AntText strong style={{ color: '#666', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Text Size</AntText>
                <AntText strong style={{ color: '#e69a9d' }}>{Math.round(fontSize * 100)}</AntText>
              </div>
              <Slider
                min={0.06} max={0.28} step={0.01} value={fontSize} onChange={setFontSize}
                trackStyle={{ backgroundColor: '#e69a9d', height: '6px' }}
                handleStyle={{ borderColor: '#e69a9d', height: '16px', width: '16px', marginTop: '-5px' }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* SHOWCASE SECTION */}
      <section style={{ background: '#3c3842', padding: '80px 0', textAlign: 'center', marginBottom: '100px', position: 'relative' }}>
        <Title level={2} style={{ color: '#e69a9d', fontSize: '2.5rem', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Creative Rings Showcase
        </Title>
        <Paragraph style={{ color: '#e0e0e0', fontSize: '1.2rem', marginBottom: '50px' }}>
          See the unique, bespoke rings brought to life by our community of makers.
        </Paragraph>
        
        <div style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <Button 
            shape="circle" icon={<ChevronLeft size={24} />} onClick={() => scrollShowcase('left')}
            style={{ position: 'absolute', left: '2%', zIndex: 10, width: '50px', height: '50px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          />
          <div ref={showcaseRef} style={{ display: 'flex', overflowX: 'auto', gap: '24px', padding: '20px 5%', scrollbarWidth: 'none', msOverflowStyle: 'none', scrollBehavior: 'smooth', width: '100%' }}>
            {showcaseImages.map((src, idx) => (
              <motion.div key={idx} whileHover={{ scale: 1.03 }} style={{ flexShrink: 0 }}>
                <img src={src} alt={`Showcase ${idx + 1}`} style={{ height: '300px', width: '300px', borderRadius: '20px', objectFit: 'cover', boxShadow: '0 10px 30px rgba(0,0,0,0.4)', border: '2px solid rgba(255,255,255,0.05)' }} />
              </motion.div>
            ))}
          </div>
          <Button 
            shape="circle" icon={<ChevronRight size={24} />} onClick={() => scrollShowcase('right')}
            style={{ position: 'absolute', right: '2%', zIndex: 10, width: '50px', height: '50px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}
          />
        </div>
      </section>

      {/* FOUNDER STORY SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={sectionVariants}
        style={{ padding: '0 5%', maxWidth: '1200px', margin: '0 auto 120px auto' }}
      >
        <Row gutter={[60, 40]} align="middle">
          <Col xs={24} md={10}>
            <div style={{ position: 'relative' }}>
              <img 
                src="https://ddreamerjewelry.com/wp-content/uploads/2023/07/Ddreamer-Jewelry-Making-workshops-Ho-Chi-Minh-City-Saigon-Vietnam-Kid-Friendly-Workshops-17.jpg" 
                alt="Silversmith Crafting" 
                style={{ width: '100%', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', aspectRatio: '4/3', objectFit: 'cover' }}
              />
            </div>
          </Col>
          <Col xs={24} md={14}>
            <Title level={2} style={{ fontSize: '3rem', marginBottom: '24px' }}>
              Fostering <span style={{ color: '#e69a9d' }}>Memories</span>
            </Title>
            <Paragraph style={{ fontSize: '1.15rem', color: '#555', lineHeight: '1.8', marginBottom: '20px' }}>
              Our workshops provide an ideal setting for couples, friends, and families to bond and create lasting memories. As you embark on this creative journey together, you share in the joy of discovery and spark deeper connections.
            </Paragraph>
            <Paragraph style={{ fontSize: '1.15rem', color: '#555', lineHeight: '1.8' }}>
              The jewelry pieces crafted during our sessions serve as tangible tokens of these cherished moments. Each time you wear your creation, you are reminded of the love, laughter, and support that surrounded you during your artistic endeavor.
            </Paragraph>
            <div style={{ marginTop: '40px' }}>
              <AntText style={{ fontFamily: 'var(--heading-font)', fontSize: '2rem', fontStyle: 'italic', display: 'block', color: '#111' }}>
                Dieu Tran
              </AntText>
              <AntText style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem', color: '#888', fontWeight: 'bold' }}>
                Founder & Head Silversmith
              </AntText>
            </div>
          </Col>
        </Row>
      </motion.section>

      {/* Áp dụng Tip 5: Overcoming Objections (Giải quyết băn khoăn) */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        variants={sectionVariants} 
        style={{ padding: '0 5%', maxWidth: '900px', margin: '0 auto 100px auto' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <HeartHandshake size={48} color="#e69a9d" style={{ marginBottom: '16px' }} />
          <Title level={2} style={{ fontSize: '2.5rem' }}>First Time? <span style={{ color: '#e69a9d' }}>We Got You.</span></Title>
        </div>
        <Collapse 
          accordion 
          items={faqItems} 
          bordered={false}
          style={{ background: '#fff', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}
        />
      </motion.section>

      {/* REVIEWS SECTION */}
      <motion.section 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.2 }} 
        variants={sectionVariants} 
        style={{ padding: '100px 5%', background: '#fff', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', marginBottom: '100px' }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Title level={2} style={{ fontSize: '3rem', marginBottom: '16px' }}>What Our <span style={{ color: '#e69a9d' }}>Ddreamers</span> Say</Title>
            <Space align="center" style={{ fontSize: '1.2rem' }}>
              <AntText strong style={{ fontSize: '28px' }}>5.0</AntText>
              <Rate disabled defaultValue={5} style={{ color: '#fbbc04', fontSize: '24px' }} />
              <AntText type="secondary" style={{ marginLeft: '8px' }}>from 376 Google Reviews</AntText>
            </Space>
          </div>

          <Row gutter={[32, 32]} justify="center">
            {reviewsData.map((review) => (
              <Col xs={24} md={8} key={review.id}>
                <motion.div whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Card 
                    bordered={false} 
                    style={{ borderRadius: '24px', background: '#fafafa', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', height: '100%', padding: '20px 10px', position: 'relative', overflow: 'visible' }}
                  >
                    <GoogleOutlined style={{ position: 'absolute', top: 20, right: 20, color: '#4285F4', fontSize: '20px' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '16px' }}>
                      <Avatar src={review.avatar} size={64} style={{ border: '3px solid #fff', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginTop: '-50px' }} />
                      <AntText strong style={{ marginTop: '12px', fontSize: '1.1rem', display: 'block' }}>{review.name}</AntText>
                      <Space size={4} style={{ marginTop: '4px' }}>
                        <Rate disabled defaultValue={review.rating} style={{ color: '#fbbc04', fontSize: '12px' }} />
                        <AntText type="secondary" style={{ fontSize: '0.8rem', marginLeft: '4px' }}>{review.date}</AntText>
                      </Space>
                    </div>
                    <Paragraph style={{ color: '#555', fontSize: '1.05rem', lineHeight: '1.6', textAlign: 'center' }}>"{review.content}"</Paragraph>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>
      </motion.section>

      {/* BOOKING SECTION - Áp dụng Tip 6: Final CTA */}
      <motion.section 
        id="booking-section"
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.5 }} 
        variants={sectionVariants} 
        style={{ maxWidth: '800px', margin: '0 auto 120px auto', padding: '0 5%', textAlign: 'center' }}
      >
        <Title level={2} style={{ fontSize: '3rem', marginBottom: '16px' }}>Reserve Your <span style={{ color: '#e69a9d' }}>Spot</span></Title>
        <Paragraph style={{ fontSize: '1.2rem', color: '#666', marginBottom: '50px' }}>
          Select a date and time to begin your silversmithing journey.
        </Paragraph>
        
        <div style={{ background: '#fff', padding: '40px', borderRadius: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.06)' }}>
          <DatePicker 
            onChange={handleDateChange} 
            disabledDate={disabledDate} 
            style={{ width: '100%', marginBottom: '30px', borderRadius: '16px', padding: '16px', fontSize: '1.2rem', border: '1px solid #ddd' }} 
            size="large" 
            placeholder="Select a date" 
          />
          
          {selectedDate && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px', flexWrap: 'wrap' }}>
              {timeSlots.map((time) => {
                const soldOut = isTimeSlotSoldOut(time);
                const isSelected = selectedTime === time;
                return (
                  <Button 
                    key={time} 
                    onClick={() => !soldOut && setSelectedTime(time)} 
                    disabled={soldOut} 
                    style={{ 
                      background: soldOut ? '#f0f0f0' : (isSelected ? '#FDF2F8' : '#fff'), 
                      color: soldOut ? '#aaa' : (isSelected ? '#880e4f' : '#444'),         
                      borderColor: soldOut ? '#f0f0f0' : (isSelected ? '#e69a9d' : '#ddd'),
                      height: '56px', fontSize: '1.1rem', flex: 1, minWidth: '140px', borderRadius: '16px', 
                      fontWeight: isSelected ? '700' : '500',
                      transition: 'all 0.3s'
                    }}
                  >
                    {soldOut ? 'Sold Out' : time}
                  </Button>
                );
              })}
            </div>
          )}

          <Button 
            size="large" 
            disabled={!selectedDate || !selectedTime} 
            onClick={handleConfirmBooking}
            style={{ 
              background: (!selectedDate || !selectedTime) ? '#e0e0e0' : 'linear-gradient(135deg, #e69a9d 0%, #f06292 100%)', 
              color: (!selectedDate || !selectedTime) ? '#999' : '#fff',
              border: 'none', width: '100%', height: '64px', fontSize: '1.2rem', borderRadius: '16px', fontWeight: '600', letterSpacing: '1px',
              boxShadow: (!selectedDate || !selectedTime) ? 'none' : '0 10px 25px rgba(230, 154, 157, 0.4)'
            }}
          >
            CONFIRM BOOKING
          </Button>
          <AntText type="secondary" style={{ display: 'block', marginTop: '16px', fontSize: '0.9rem' }}>
            ⚡ Spaces fill up weeks in advance. Don't miss out!
          </AntText>
        </div>
      </motion.section>

      {/* SUCCESS MODAL ĐÃ ĐƯỢC LÀM SINH ĐỘNG */}
      <Modal
        title={null}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={450}
        centered
        closeIcon={false}
        styles={{ body: { padding: 0, borderRadius: '24px', overflow: 'hidden' } }}
      >
        <div style={{ background: 'linear-gradient(135deg, #e69a9d 0%, #f06292 100%)', padding: '40px 30px', textAlign: 'center' }}>
          <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '50%', marginBottom: '20px' }}>
            <Sparkles size={48} color="#fff" />
          </div>
          <Title level={3} style={{ margin: '0 0 10px 0', fontSize: '1.8rem', color: '#fff' }}>Design Saved! </Title>
          <AntText style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.9)' }}>We can't wait to see you at the studio.</AntText>
        </div>

        <div style={{ padding: '30px' }}>
          <div style={{ background: '#FDF2F8', padding: '24px', borderRadius: '20px', border: '1px solid rgba(230, 154, 157, 0.3)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px', color: '#880e4f' }}>
              <CalendarIcon size={20} style={{ marginRight: '12px' }} />
              <AntText style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#880e4f' }}>{selectedDate ? selectedDate.format('MMMM D, YYYY') : ''}</AntText>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#880e4f' }}>
              <Clock size={20} style={{ marginRight: '12px' }} />
              <AntText style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#880e4f' }}>{selectedTime}</AntText>
            </div>
          </div>

          <Title level={5} style={{ marginBottom: '16px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.85rem' }}>Your Custom Blueprint</Title>
          <div style={{ background: '#fafafa', padding: '20px', borderRadius: '20px', marginBottom: '30px', border: '1px solid #eee' }}>
            <Row justify="space-between" style={{ marginBottom: '12px' }}>
              <AntText type="secondary">Material</AntText>
              <AntText strong>{material === 'silver' ? 'Silver 925' : 'Gold-plated'}</AntText>
            </Row>
            <Row justify="space-between" style={{ marginBottom: '12px' }}>
              <AntText type="secondary">Finish</AntText>
              <AntText strong>{finish === 'smooth' ? 'Smooth' : 'Satin Matte'}</AntText>
            </Row>
            <Row justify="space-between" style={{ marginBottom: '12px' }}>
              <AntText type="secondary">Placement</AntText>
              <AntText strong>{engravePosition === 'inside' ? 'Inner Band' : 'Outer Band'}</AntText>
            </Row>
            <Row justify="space-between">
              <AntText type="secondary">Engraving</AntText>
              <AntText strong style={{ fontStyle: 'italic', color: '#e69a9d' }}>"{engravingText}"</AntText>
            </Row>
          </div>

          <div style={{ display: 'flex', width: '100%', gap: '12px' }}>
            <Button size="large" onClick={() => setIsModalOpen(false)} style={{ flex: 1, borderRadius: '12px', height: '50px', background: '#f0f0f0', color: '#444', border: 'none', fontWeight: '600' }}>
              Close
            </Button>
            <Button type="primary" size="large" onClick={() => setIsModalOpen(false)} style={{ flex: 1, background: 'linear-gradient(135deg, #e69a9d 0%, #f06292 100%)', color: '#fff', border: 'none', borderRadius: '12px', height: '50px', fontWeight: '600', boxShadow: '0 4px 15px rgba(230, 154, 157, 0.4)' }}>
              Add to Calendar
            </Button>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
}