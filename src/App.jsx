import { useState, useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Torus, Text, Environment, ContactShadows } from '@react-three/drei';
import { Radio, Input, Button, Rate, DatePicker, Slider, Modal } from 'antd';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import 'antd/dist/reset.css';
import logoImg from './assets/Ddreamer-Jewelry-Ddreamer-Studio-1.png';
import heroImg from './assets/hero.png';

const CurvedEngraving = ({ text, material, finish, positionType, fontSize }) => {
  // Tinh chỉnh màu chữ: Đen tuyền trên nền bóng, nhạt hơn trên nền nhám
  const getTextColor = () => {
    if (finish === 'smooth') {
      return material === 'gold' ? '#FFFDD0' : '#FFFFFF'; // Đậm tối đa để chống lóa
    }
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
    // Giảm clearcoat để nhẫn bóng nhưng không bị lóa nuốt chữ
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

const Header = () => (
  <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px', background: 'white', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
    <img src={logoImg} alt="Ddreamer" style={{ height: '48px', width: 'auto' }} />
    <nav>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '30px' }}>
        <li><a href="#workshops" style={{ textDecoration: 'none', color: '#555', fontSize: '1.1em', transition: 'color 0.3s' }}>Workshops</a></li>
        <li><a href="#collections" style={{ textDecoration: 'none', color: '#555', fontSize: '1.1em', transition: 'color 0.3s' }}>Collections</a></li>
        <li><a href="#about" style={{ textDecoration: 'none', color: '#555', fontSize: '1.1em', transition: 'color 0.3s' }}>About Us</a></li>
        <li><a href="#contact" style={{ textDecoration: 'none', color: '#555', fontSize: '1.1em', transition: 'color 0.3s' }}>Contact</a></li>
      </ul>
    </nav>
  </header>
);

const Footer = () => (
  <footer style={{ background: '#333333', color: '#f8f8f8', padding: '60px 40px', textAlign: 'center' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px', textAlign: 'left' }}>
      <div>
        <img src={logoImg} alt="Ddreamer" style={{ height: '40px', width: 'auto', marginBottom: '20px', filter: 'brightness(0) invert(1)' }} />
        <p style={{ fontSize: '0.9em', lineHeight: '1.6' }}>Crafting dreams into reality, one masterpiece at a time. Experience the art of silversmithing with Ddreamer.</p>
      </div>
      <div>
        <h4 style={{ color: '#f06292', fontSize: '1.4em', marginBottom: '20px' }}>Quick Links</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}><a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Workshops</a></li>
          <li style={{ marginBottom: '10px' }}><a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Collections</a></li>
        </ul>
      </div>
      <div>
        <h4 style={{ color: '#f06292', fontSize: '1.4em', marginBottom: '20px' }}>Connect</h4>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}><a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Instagram</a></li>
          <li style={{ marginBottom: '10px' }}><a href="#" style={{ textDecoration: 'none', color: '#ccc' }}>Facebook</a></li>
        </ul>
      </div>
    </div>
    <div style={{ borderTop: '1px solid #555', marginTop: '40px', paddingTop: '20px', fontSize: '0.9em', color: '#ccc' }}>
      © {new Date().getFullYear()} Ddreamer. All rights reserved.
    </div>
  </footer>
);

const App = () => {
  const [engravingText, setEngravingText] = useState('Ddreamer');
  const [material, setMaterial] = useState('silver');
  const [finish, setFinish] = useState('smooth');
  const [engravePosition, setEngravePosition] = useState('outside');
  const [fontSize, setFontSize] = useState(0.12); 
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  
  // State quản lý hiển thị Popup Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const workshop = {
    title: 'Make a Simple Ring',
    price: '$95',
    duration: '3 hours',
    founderQuote: "In every delicate curve and gleaming facet, we don't just craft jewelry; we preserve the soul of silversmithing, forging human connections that last a lifetime.",
  };

  const reviews = [
    { id: 1, author: 'Chloe G.', rating: 5, text: "The Ddreamer workshop was a truly <b style=\"color: #880e4f;\">unique experience</b>! Highly recommend for Gen Z!" },
    { id: 2, author: 'Ethan S.', rating: 5, text: "Finally a workshop that gets it! <b style=\"color: #880e4f;\">Meaningful</b> craft, modern vibe." },
    { id: 3, author: 'Sophia L.', rating: 5, text: "Adored the personalized experience. Fostering real <b style=\"color: #880e4f;\">human connection</b>." },
  ];

  const disabledDate = (current) => current.date() % 5 === 0 || current.date() % 7 === 0;
  const timeSlots = ['09:30 AM', '02:00 PM', '06:00 PM'];
  const SOLD_OUT_SLOT = '02:00 PM';
  const isTimeSlotSoldOut = (time) => selectedDate && time === SOLD_OUT_SLOT;

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  };

  // Hàm xử lý khi bấm Confirm Booking
  const handleConfirmBooking = () => {
    setIsModalOpen(true);
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  return (
    <div style={{ background: '#FDF2F8', color: '#333333', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Header />
      
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
        style={{ textAlign: 'center', padding: '80px 20px', background: 'linear-gradient(135deg, #ffffff 0%, #FDF2F8 100%)', marginBottom: '80px', overflow: 'hidden' }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '50px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <img src={heroImg} alt="Founder" style={{ borderRadius: '15px', maxWidth: '100%', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }} />
          </div>
          <div style={{ flex: 2, minWidth: '300px', textAlign: 'left' }}>
            <h1 style={{ fontSize: '3.8em', color: '#880e4f', marginBottom: '20px', lineHeight: '1.1' }}>{workshop.title}</h1>
            <p style={{ fontSize: '1.8em', color: '#555', marginBottom: '30px' }}>{workshop.price} | {workshop.duration}</p>
            <blockquote style={{ fontSize: '1.4em', fontStyle: 'italic', color: '#666', lineHeight: '1.6', borderLeft: '4px solid #f06292', paddingLeft: '20px' }}>
              {workshop.founderQuote}
            </blockquote>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={sectionVariants}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '1200px', margin: '0 auto 80px auto', padding: '40px', borderRadius: '20px', background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}
      >
        <h2 style={{ fontSize: '3em', color: '#880e4f', marginBottom: '40px', textAlign: 'center' }}>Design Your Masterpiece</h2>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '60px', width: '100%', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1.5 1 400px', minWidth: '400px', height: '650px', position: 'relative', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', background: '#FDF2F8' }}>
            <Canvas camera={{ position: [0, 3, 5], fov: 45 }}>
              <Environment preset="studio" />
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 10, 5]} intensity={1.5} />
              <OrbitControls enableZoom={true} enablePan={false} autoRotate autoRotateSpeed={1.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
              <Ring engravingText={engravingText} material={material} finish={finish} positionType={engravePosition} fontSize={fontSize} />
              <ContactShadows opacity={0.3} scale={10} blur={2.5} far={10} resolution={256} color="#000000" position={[0, -0.6, 0]} />
            </Canvas>
          </div>

          <div style={{ flex: '1 1 300px', minWidth: '300px', padding: '20px', position: 'relative', zIndex: 50 }}>
            <h3 style={{ fontSize: '2em', color: '#333333', marginBottom: '25px' }}>Customize Your Ring</h3>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '10px', fontSize: '1.1em', color: '#555' }}>Material:</p>
              <Radio.Group onChange={(e) => setMaterial(e.target.value)} value={material} buttonStyle="solid" size="large">
                <Radio.Button value="silver" style={{ borderColor: '#f06292', color: material === 'silver' ? 'white' : '#f06292', background: material === 'silver' ? '#f06292' : 'white' }}>Silver 925</Radio.Button>
                <Radio.Button value="gold" style={{ borderColor: '#f06292', color: material === 'gold' ? 'white' : '#f06292', background: material === 'gold' ? '#f06292' : 'white' }}>Gold-plated</Radio.Button>
              </Radio.Group>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '10px', fontSize: '1.1em', color: '#555' }}>Surface Finish:</p>
              <Radio.Group onChange={(e) => setFinish(e.target.value)} value={finish} buttonStyle="solid" size="large">
                <Radio.Button value="smooth" style={{ borderColor: '#f06292', color: finish === 'smooth' ? 'white' : '#f06292', background: finish === 'smooth' ? '#f06292' : 'white' }}>Smooth</Radio.Button>
                <Radio.Button value="matte" style={{ borderColor: '#f06292', color: finish === 'matte' ? 'white' : '#f06292', background: finish === 'matte' ? '#f06292' : 'white' }}>Matte (Satin)</Radio.Button>
              </Radio.Group>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '10px', fontSize: '1.1em', color: '#555', fontWeight: 'bold' }}>Engraving Position:</p>
              <Radio.Group onChange={(e) => setEngravePosition(e.target.value)} value={engravePosition} buttonStyle="solid" size="large">
                <Radio.Button value="outside" style={{ borderColor: '#880e4f', color: engravePosition === 'outside' ? 'white' : '#880e4f', background: engravePosition === 'outside' ? '#880e4f' : 'white' }}>Outer Band</Radio.Button>
                <Radio.Button value="inside" style={{ borderColor: '#880e4f', color: engravePosition === 'inside' ? 'white' : '#880e4f', background: engravePosition === 'inside' ? '#880e4f' : 'white' }}>Inner Band</Radio.Button>
              </Radio.Group>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <p style={{ marginBottom: '10px', fontSize: '1.1em', color: '#555' }}>Engraving Text:</p>
              <Input
                placeholder="Type message..."
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value)}
                style={{ borderColor: '#f06292', height: '45px', fontSize: '1.2em' }}
                maxLength={20}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '1.1em', color: '#555' }}>Text Size:</p>
                <span style={{ color: '#880e4f', fontWeight: 'bold' }}>{Math.round(fontSize * 100)}</span>
              </div>
              <Slider
                min={0.06}
                max={0.28}
                step={0.01}
                value={fontSize}
                onChange={setFontSize}
                trackStyle={{ backgroundColor: '#f06292' }}
                handleStyle={{ borderColor: '#880e4f', backgroundColor: '#fff' }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={sectionVariants} style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '40px', borderRadius: '20px', background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '3em', color: '#880e4f', marginBottom: '40px', textAlign: 'center' }}>What Our Ddreamers Say</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
          {reviews.map((review) => (
            <motion.div key={review.id} whileHover={{ scale: 1.03 }} style={{ background: '#FDF2F8', padding: '30px', borderRadius: '15px' }}>
              <Rate disabled defaultValue={review.rating} character={<Star size={18} fill="#f06292" stroke="none" />} style={{ marginBottom: '15px', color: '#f06292' }} />
              <p style={{ fontSize: '1.1em', color: '#333', lineHeight: '1.6', marginBottom: '20px' }} dangerouslySetInnerHTML={{ __html: review.text }} />
              <p style={{ fontWeight: 'bold', color: '#880e4f' }}>- {review.author}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={sectionVariants} style={{ maxWidth: '1200px', margin: '0 auto 80px auto', padding: '50px', borderRadius: '20px', background: 'white', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', textAlign: 'center' }}>
        <h2 style={{ fontSize: '3em', color: '#880e4f', marginBottom: '40px' }}>Book Your Unique Experience</h2>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <DatePicker onChange={handleDateChange} disabledDate={disabledDate} style={{ width: '100%', marginBottom: '20px', borderColor: '#f06292', height: '45px', fontSize: '1.2em' }} size="large" placeholder="Select a date" />
          {!selectedDate ? (
            <p style={{ color: '#888', fontSize: '1.1em', marginBottom: '30px', fontStyle: 'italic' }}>Please select a date.</p>
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
              {timeSlots.map((time) => {
                const soldOut = isTimeSlotSoldOut(time);
                return (
                  <Button key={time} type={selectedTime === time ? 'primary' : 'default'} onClick={() => !soldOut && setSelectedTime(time)} disabled={soldOut} style={{ background: soldOut ? '#e0e0e0' : (selectedTime === time ? '#f06292' : 'white'), color: soldOut ? '#999' : (selectedTime === time ? 'white' : '#f06292'), height: '50px', fontSize: '1.1em', flex: 1, maxWidth: '150px' }}>
                    {soldOut ? 'Sold Out' : time}
                  </Button>
                );
              })}
            </div>
          )}
        </div>
        <Button 
          type="primary" 
          size="large" 
          disabled={!selectedDate || !selectedTime} 
          onClick={handleConfirmBooking}
          style={{ background: (!selectedDate || !selectedTime) ? '#ccc' : '#880e4f', marginTop: '20px', height: '60px', fontSize: '1.4em', padding: '0 40px', borderRadius: '30px' }}
        >
          Confirm Booking
        </Button>
      </motion.section>

      {/* POPUP XÁC NHẬN ĐẶT LỊCH */}
      <Modal
        title={<span style={{ fontSize: '1.5em', color: '#880e4f', fontFamily: 'system-ui, sans-serif' }}>Booking Confirmed! 🎉</span>}
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalOpen(false)} style={{ borderRadius: '20px' }}>
            Close
          </Button>,
          <Button key="submit" type="primary" style={{ background: '#f06292', borderColor: '#f06292', borderRadius: '20px' }} onClick={() => setIsModalOpen(false)}>
            Add to Calendar
          </Button>,
        ]}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
          {/* Ảnh minh họa Workshop chế tác trang sức */}
          <img 
            src="https://images.unsplash.com/photo-1573408301145-b98c4af06b58?auto=format&fit=crop&w=600&q=80" 
            alt="Jewelry Crafting Workshop" 
            style={{ width: '100%', borderRadius: '12px', marginBottom: '15px', objectFit: 'cover', height: '200px' }} 
          />
          <h3 style={{ color: '#333', fontSize: '1.3em', marginBottom: '5px' }}>Make a Simple Ring Workshop</h3>
          <p style={{ color: '#777', fontStyle: 'italic' }}>Ddreamer Studio, Ho Chi Minh City</p>
        </div>
        
        <div style={{ background: '#FDF2F8', padding: '20px', borderRadius: '12px', border: '1px solid #fbe9e7' }}>
          <p style={{ fontSize: '1.1em', marginBottom: '10px' }}>
            <strong style={{ color: '#880e4f' }}>📅 Date: </strong> 
            {selectedDate ? selectedDate.format('MMMM D, YYYY') : ''}
          </p>
          <p style={{ fontSize: '1.1em', marginBottom: '15px' }}>
            <strong style={{ color: '#880e4f' }}>⏰ Time: </strong> 
            {selectedTime}
          </p>
          <div style={{ borderTop: '1px dashed #f06292', paddingTop: '15px' }}>
            <p style={{ fontSize: '1.1em', marginBottom: '10px', fontWeight: 'bold', color: '#555' }}>💍 Your Custom Design:</p>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: '#444', lineHeight: '1.6' }}>
              <li>Material: {material === 'silver' ? 'Silver 925' : 'Gold-plated'}</li>
              <li>Finish: {finish === 'smooth' ? 'Smooth' : 'Matte (Satin)'}</li>
              <li>Text: "{engravingText}"</li>
              <li>Position: {engravePosition === 'inside' ? 'Inner Band' : 'Outer Band'}</li>
            </ul>
          </div>
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default App;