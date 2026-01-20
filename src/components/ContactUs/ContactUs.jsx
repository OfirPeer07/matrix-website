import React, { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Phone, Mail, MessageCircle, Linkedin, Github, 
  Clock, ExternalLink, MapPin, Cpu 
} from "lucide-react";
import "./ContactUs.css";

// רכיב הגשם הדיגיטלי
const MatrixDrop = ({ IconComponent, delay, columnX, scale, opacity, speed }) => {
  return (
    <motion.div
      className="matrix-drop-wrapper"
      initial={{ y: -150, x: columnX, opacity: 0 }}
      animate={{ 
        y: window.innerHeight + 200,
        opacity: [0, opacity, opacity, 0] 
      }}
      transition={{
        duration: speed,
        ease: "linear",
        delay: delay,
        repeat: Infinity,
      }}
      style={{ 
        position: "fixed", top: 0, left: 0,
        zIndex: scale > 1 ? 1 : 0,
        filter: scale < 0.8 ? "blur(1px)" : "none",
        pointerEvents: "none"
      }}
    >
      <IconComponent 
        size={20 * scale} 
        color={scale > 1.1 ? "#00FF00" : "#004400"} 
        style={{ filter: "drop-shadow(0 0 5px rgba(0, 255, 0, 0.5))" }}
      />
      <div 
        className="digital-trail" 
        style={{ 
          height: 80 * scale,
          width: "1px",
          marginTop: "2px",
          opacity: 0.4,
          background: `linear-gradient(to bottom, ${scale > 1.1 ? '#00FF00' : '#004400'} 0%, transparent 100%)`
        }} 
      />
    </motion.div>
  );
};

const ContactUs = () => {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const israelTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "Asia/Jerusalem",
        hour: "numeric",
        hour12: false,
      }).format(new Date());
      
      const hour = parseInt(israelTime);
      setIsLive(hour >= 9 && hour < 19);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const CONTACTS = [
    { id: "phone", label: "COMMUNICATION_VOICE", val: "+972 50 408 2153", Icon: Phone, url: "tel:+972504082153" },
    { id: "email", label: "COMMUNICATION_MAIL", val: "ofirpeer07@gmail.com", Icon: Mail, url: "https://mail.google.com/mail/?view=cm&fs=1&to=ofirpeer07@gmail.com" },
    { id: "whatsapp", label: "INSTANT_MESSAGING", val: "WhatsApp Messages", Icon: MessageCircle, url: "https://wa.me/972504082153" },
    { id: "linkedin", label: "PROFESSIONAL_NET", val: "Ofir Peer", Icon: Linkedin, url: "https://linkedin.com/in/ofirpeer" },
    { id: "github", label: "REPOSITORIES", val: "ofirpeer07", Icon: Github, url: "https://github.com/ofirpeer07" },
  ];

  const rainDrops = useMemo(() => {
    return Array.from({ length: 100 }).map((_, i) => ({
      Icon: CONTACTS[i % CONTACTS.length].Icon,
      delay: Math.random() * 20,
      columnX: Math.random() * window.innerWidth,
      scale: 0.3 + Math.random() * 1.3,
      opacity: 0.1 + Math.random() * 0.4,
      speed: 6 + Math.random() * 12
    }));
  }, []);

  return (
    <div className="matrix-viewport">
      <button className="cyber-back-btn" onClick={() => window.history.back()}>
        BACK_
      </button>

      <div className="matrix-rain-layer">
        {rainDrops.map((drop, i) => (
          <MatrixDrop key={i} {...drop} IconComponent={drop.Icon} />
        ))}
      </div>

      <motion.div 
        className="glass-panel"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="corner-tag tl" /> <div className="corner-tag tr" />
        <div className="corner-tag bl" /> <div className="corner-tag br" />

        <header className="panel-header">
          <div className="status-bar">
            <Cpu size={14} className="spin-icon" />
            <span className="blink-text">LINK_ESTABLISHED_SECURE</span>
          </div>
          <h1 className="cyber-title">CONTACT_<span>CORE</span></h1>
        </header>

        <div className="interaction-list">
          {CONTACTS.map(({ id, label, val, Icon, url }, index) => (
            <motion.a 
              key={id} 
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-row"
              whileHover={{ x: 8 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="row-main-content">
                <div className="icon-container">
                  <Icon size={20} />
                </div>
                <div className="info-stack">
                  <span className="info-label">{label}</span>
                  <span className="info-value">{val}</span>
                </div>
              </div>
              
              {/* רמז ויזואלי ליציאה חיצונית */}
              <div className="external-hint">
                <ExternalLink size={16} />
              </div>
            </motion.a>
          ))}
        </div>

        <footer className="panel-footer">
          <div className="footer-status">
            <div className="status-item">
              <MapPin size={12} /> <span>LOCATION: ISRAEL</span>
            </div>
            <div className="status-item">
              <Clock size={12} color={isLive ? "#00FF00" : "#FF0000"} /> 
              <span>STATUS: 09:00 - 19:00</span>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default ContactUs;