import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { articlesApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const Editor: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tagList, setTagList] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const isEditing = !!slug;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (isEditing) {
      fetchArticle();
    }
  }, [isAuthenticated, isEditing, slug]);

  const fetchArticle = async () => {
    try {
      const response = await articlesApi.getArticle(slug!);
      const article = response.data.article;
      setTitle(article.title);
      setDescription(article.description);
      setBody(article.body);
      setTagList(article.tagList);
    } catch (error) {
      console.error('Error fetching article:', error);
      navigate('/');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      const articleData = {
        article: {
          title,
          description,
          body,
          tagList,
        },
      };

      const response = isEditing
        ? await articlesApi.updateArticle(slug!, articleData)
        : await articlesApi.createArticle(articleData);

      navigate(`/article/${response.data.article.slug}`);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat() as string[];
        setErrors(errorMessages);
      } else {
        setErrors(['An error occurred while saving the article']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tagList.includes(tag)) {
        setTagList([...tagList, tag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagList(tagList.filter(tag => tag !== tagToRemove));
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {errors.length > 0 && (
              <div className="error-messages">
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    required
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags (press Enter to add)"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                  />
                  <div className="tag-list" style={{ marginTop: '0.5rem' }}>
                    {tagList.map((tag, index) => (
                      <span key={index} className="tag-default" style={{ marginRight: '0.25rem' }}>
                        <i
                          className="ion-close-round"
                          onClick={() => removeTag(tag)}
                          style={{ cursor: 'pointer', marginRight: '0.25rem' }}
                        ></i>
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>
                <button
                  className="btn btn-lg pull-xs-right btn-primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Publishing...' : (isEditing ? 'Update Article' : 'Publish Article')}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
