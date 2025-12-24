import { useState, useEffect } from 'react';

const useNeoMarkdown = () => {
  const [articles, setArticles] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const folders = {
      'NeoArticles': { title: 'Neo Articles', path: 'Neo/hacking/articles' },
      'NeoGuides': { title: 'Neo Guides', path: 'Neo/hacking/guides' },
    };

    const importAll = (r) => {
      try {
        return r.keys().map((fileName) => ({
          title: fileName.replace('./', '').replace('.md', '').replace(/-/g, ' '),
          path: fileName.replace('./', '')
        }));
      } catch (error) {
        setError('Error loading files');
        console.warn('Error importing files:', error);
        return [];
      }
    };

    try {
      const NeoArticles = importAll(require.context('../../../../public/md/NeoArticles', false, /\.md$/));
      const NeoGuides = importAll(require.context('../../../../public/md/NeoGuides', false, /\.md$/));

      setArticles({
        NeoArticles: { title: folders.NeoArticles.title, path: folders.NeoArticles.path, files: NeoArticles },
        NeoGuides: { title: folders.NeoGuides.title, path: folders.NeoGuides.path, files: NeoGuides },
      });
    } catch (error) {
      setError('Error loading articles');
      console.error('Error loading markdown files:', error);
    }
  }, []);

  return { articles, error };
};

export default useNeoMarkdown;