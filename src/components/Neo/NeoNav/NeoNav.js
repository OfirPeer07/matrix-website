import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NeoNav.css';

const NeoNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [articles, setArticles] = useState({});
  const [error, setError] = useState(null);
  const [isScrollingDown, setIsScrollingDown] = useState(false); // למעקב אחרי כיוון הגלילה

  useEffect(() => {
    const folders = {
      'NeoArticles': { 
        title: 'Neo Articles',
        path: 'Neo/hacking/articles'
      },
      'NeoGuides': { 
        title: 'Neo Guides',
        path: 'Neo/hacking/guides'
      },
    };

    // פונקציה חדשה שמשתמשת ב-API במקום ב-require.context
    const fetchFilesFromAPI = async (folderName) => {
      try {
        // ננסה להשתמש ב-API PHP תחילה
        const apiResponse = await fetch(`/md-files.php?folder=${folderName}`);
        if (apiResponse.ok) {
          const data = await apiResponse.json();
          if (data.files && data.files.length > 0) {
            console.log(`Found ${data.files.length} MD files via PHP API for NAV (${folderName}):`, data.files);
            return data.files.map(file => ({
              title: file.name.replace('.md', '').replace(/-/g, ' '),
              path: file.name
            }));
          }
        }
        // אם ה-API נכשל, ננסה את השיטה הישנה
        return fallbackToWebpack(folderName);
      } catch (error) {
        console.log('PHP API not available for NAV, trying webpack method:', error);
        return fallbackToWebpack(folderName);
      }
    };

    // פונקציית גיבוי שמשתמשת בשיטה הישנה
    const fallbackToWebpack = (folderName) => {
      try {
        if (folderName === 'NeoArticles') {
          return importAll(require.context('../../../../public/md/NeoArticles', false, /\.md$/));
        } else if (folderName === 'NeoGuides') {
          return importAll(require.context('../../../../public/md/NeoGuides', false, /\.md$/));
        }
        return [];
      } catch (error) {
        console.error(`Error in webpack fallback for ${folderName}:`, error);
        return [];
      }
    };

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

    // פונקציה שמאחדת את כל המידע
    const loadAllFiles = async () => {
      try {
        const NeoArticles = await fetchFilesFromAPI('NeoArticles');
        const NeoGuides = await fetchFilesFromAPI('NeoGuides');

        const articlesData = {
          NeoArticles: { title: folders.NeoArticles.title, path: folders.NeoArticles.path, files: NeoArticles },
          NeoGuides: { title: folders.NeoGuides.title, path: folders.NeoGuides.path, files: NeoGuides },
        };

        setArticles(articlesData);
      } catch (error) {
        setError('Error loading articles');
        console.error('Error loading markdown files:', error);
      }
    };

    loadAllFiles();
  }, []);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 100) {
      setIsScrollingDown(true); // אם הגלילה למטה
    } else {
      setIsScrollingDown(false); // אם הגלילה למעלה
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <>
      <button 
        className={`toggle-nav-btn ${isOpen ? 'open' : ''} ${isScrollingDown ? 'hidden' : ''}`} 
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

export default NeoNav;
