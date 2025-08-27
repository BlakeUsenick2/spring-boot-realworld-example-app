import React, { useState, useEffect } from 'react';
import { tagsApi } from '../services/api';

interface PopularTagsProps {
  onTagClick: (tag: string) => void;
}

const PopularTags: React.FC<PopularTagsProps> = ({ onTagClick }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await tagsApi.getTags();
      setTags(response.data.tags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="sidebar">
        <p>Loading tags...</p>
      </div>
    );
  }

  return (
    <div className="sidebar">
      <p>Popular Tags</p>
      <div className="tag-list">
        {tags.map(tag => (
          <button
            key={tag}
            className="tag-default"
            onClick={() => onTagClick(tag)}
            style={{ cursor: 'pointer', border: 'none' }}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;
