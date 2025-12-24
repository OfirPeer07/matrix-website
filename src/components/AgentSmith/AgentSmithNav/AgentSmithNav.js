import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AgentSmithNav.css';

const AgentSmithNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [articles, setArticles] = useState({});
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const folders = {
      'TechnologyNews': { 
        title: 'Technology News',
        path: 'information-technology/technology-news'
      },
      'TroubleshootingGuides': { 
        title: 'Troubleshooting Guides',
        path: 'information-technology/troubleshooting-guides'
      }
    };

    // פונקציה לקבלת קבצים מה-API של PHP
    const fetchFilesFromAPI = async (folderName) => {
      try {
        // ננסה להשתמש ב-API PHP תחילה
        const apiResponse = await fetch(`/md-files.php?folder=${folderName}`);
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          if (data.files && data.files.length > 0) {
            console.log(`Found ${data.files.length} MD files via PHP API for AgentSmithNav (${folderName}):`, data.files);
            return data.files.map(file => ({
              title: file.name.replace('.md', '').replace(/-/g, ' '),
              path: file.name
            }));
          }
        }
        // אם ה-API נכשל, ננסה את השיטה הישנה
        return fallbackToWebpack(folderName);
      } catch (error) {
        console.log('PHP API not available for AgentSmithNav, trying webpack method:', error);
        return fallbackToWebpack(folderName);
      }
    };

    // פונקציית גיבוי המשתמשת ב-webpack
    const fallbackToWebpack = (folderName) => {
      try {
        const importAll = (r) => {
          try {
            const files = r.keys().map((fileName) => ({
              title: fileName.replace('./', '').replace('.md', '').replace(/-/g, ' '),
              path: fileName.replace('./', '')
            }));
            return files;
          } catch (error) {
            setError('Error loading files');
            console.warn('Error importing files:', error);
            return [];
          }
        };
        
        let context;
        switch(folderName) {
          case 'TechnologyNews':
            context = require.context('../../../../public/md/TechnologyNews', false, /\.md$/);
            break;
          case 'TroubleshootingGuides':
            context = require.context('../../../../public/md/TroubleshootingGuides', false, /\.md$/);
            break;
          default:
            return [];
        }
        return importAll(context);
      } catch (error) {
        console.error(`Error in webpack fallback for ${folderName}:`, error);
        return [];
      }
    };

    // פונקציה ראשית לטעינת הקבצים עם תמיכה ב-async/await
    const loadFiles = async () => {
      try {
        const techNews = await fetchFilesFromAPI('TechnologyNews');
        const troubleshooting = await fetchFilesFromAPI('TroubleshootingGuides');

        const articlesData = {
          TechnologyNews: { title: folders.TechnologyNews.title, path: folders.TechnologyNews.path, files: techNews },
          TroubleshootingGuides: { title: folders.TroubleshootingGuides.title, path: folders.TroubleshootingGuides.path, files: troubleshooting }
        };

        setArticles(articlesData);
      } catch (error) {
        setError('Error loading articles');
        console.error('Error loading markdown files:', error);
      }
    };

    // טעינת הקבצים כשהקומפוננטה נטענת
    loadFiles();
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);  // Hide the button when scrolling down
      } else if (window.scrollY < lastScrollY) {
        setIsVisible(true);   // Show the button when scrolling up
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <button 
        id="menuButton"
        className={`toggle-nav-btn ${isOpen ? 'open' : ''} ${isVisible ? '' : 'hidden'}`} 
        onClick={toggleNav}
        aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={isOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`sidenav ${!isOpen ? 'closed' : ''}`}>
        {Object.entries(articles).map(([category, data]) => (
          <div key={category} className="category-section">
            <h2>{data.title}</h2>
            <ul>
              {data.files && data.files.map((file, index) => (
                <li key={index}>
                  <Link to={`/${data.path}/${file.path}`} onClick={toggleNav}>
                    {file.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
};

export default AgentSmithNav;
