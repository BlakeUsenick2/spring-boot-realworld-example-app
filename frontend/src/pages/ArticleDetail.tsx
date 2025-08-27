import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { articlesApi, commentsApi, profilesApi } from '../services/api';
import { Article, Comment } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      fetchArticle();
      fetchComments();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const response = await articlesApi.getArticle(slug!);
      setArticle(response.data.article);
    } catch (error) {
      console.error('Error fetching article:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentsApi.getComments(slug!);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleFavorite = async () => {
    if (!isAuthenticated || !article) return;

    try {
      const response = article.favorited
        ? await articlesApi.unfavoriteArticle(article.slug)
        : await articlesApi.favoriteArticle(article.slug);
      
      setArticle(response.data.article);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated || !article) return;

    try {
      const response = article.author.following
        ? await profilesApi.unfollowUser(article.author.username)
        : await profilesApi.followUser(article.author.username);
      
      setArticle({
        ...article,
        author: response.data.profile
      });
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const handleDeleteArticle = async () => {
    if (!article || !window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await articlesApi.deleteArticle(article.slug);
      navigate('/');
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;

    setSubmitting(true);
    try {
      const response = await commentsApi.createComment(slug!, { comment: { body: newComment } });
      setComments([response.data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await commentsApi.deleteComment(slug!, commentId);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading article...</div>;
  }

  if (!article) {
    return <div className="loading">Article not found</div>;
  }

  const isAuthor = user?.username === article.author.username;

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src={article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} alt="" />
            </Link>
            <div className="info">
              <Link to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{formatDate(article.createdAt)}</span>
            </div>
            {isAuthenticated && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                {isAuthor ? (
                  <>
                    <Link to={`/editor/${article.slug}`} className="btn btn-outline-secondary btn-sm">
                      <i className="ion-edit"></i> Edit Article
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleDeleteArticle}
                    >
                      <i className="ion-trash-a"></i> Delete Article
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`btn btn-sm ${article.author.following ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={handleFollow}
                    >
                      <i className="ion-plus-round"></i>
                      &nbsp;
                      {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
                    </button>
                    <button
                      className={`btn btn-sm ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={handleFavorite}
                    >
                      <i className="ion-heart"></i>
                      &nbsp;
                      {article.favorited ? 'Unfavorite' : 'Favorite'} Article ({article.favoritesCount})
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <div style={{ whiteSpace: 'pre-wrap', marginBottom: '2rem' }}>
              {article.body}
            </div>
            <div className="tag-list">
              {article.tagList.map((tag, index) => (
                <span key={index} className="tag-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src={article.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} alt="" />
            </Link>
            <div className="info">
              <Link to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{formatDate(article.createdAt)}</span>
            </div>
            {isAuthenticated && (
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                {isAuthor ? (
                  <>
                    <Link to={`/editor/${article.slug}`} className="btn btn-outline-secondary btn-sm">
                      <i className="ion-edit"></i> Edit Article
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleDeleteArticle}
                    >
                      <i className="ion-trash-a"></i> Delete Article
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`btn btn-sm ${article.author.following ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={handleFollow}
                    >
                      <i className="ion-plus-round"></i>
                      &nbsp;
                      {article.author.following ? 'Unfollow' : 'Follow'} {article.author.username}
                    </button>
                    <button
                      className={`btn btn-sm ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={handleFavorite}
                    >
                      <i className="ion-heart"></i>
                      &nbsp;
                      {article.favorited ? 'Unfavorite' : 'Favorite'} Article ({article.favoritesCount})
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            {isAuthenticated ? (
              <form className="card comment-form" onSubmit={handleSubmitComment}>
                <div className="card-block">
                  <textarea
                    className="form-control"
                    placeholder="Write a comment..."
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                </div>
                <div className="card-footer">
                  <img
                    src={user?.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}
                    className="comment-author-img"
                    alt=""
                    style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '0.5rem' }}
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={submitting || !newComment.trim()}
                  >
                    {submitting ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', margin: '2rem 0' }}>
                <Link to="/login">Sign in</Link> or <Link to="/register">sign up</Link> to add comments on this article.
              </div>
            )}

            {comments.map(comment => (
              <div key={comment.id} className="card" style={{ marginTop: '1rem' }}>
                <div className="card-block">
                  <p className="card-text">{comment.body}</p>
                </div>
                <div className="card-footer">
                  <Link to={`/profile/${comment.author.username}`} className="comment-author">
                    <img
                      src={comment.author.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}
                      className="comment-author-img"
                      alt=""
                      style={{ width: '20px', height: '20px', borderRadius: '50%', marginRight: '0.25rem' }}
                    />
                  </Link>
                  &nbsp;
                  <Link to={`/profile/${comment.author.username}`} className="comment-author">
                    {comment.author.username}
                  </Link>
                  <span className="date-posted">{formatDate(comment.createdAt)}</span>
                  {user?.username === comment.author.username && (
                    <span className="mod-options">
                      <i
                        className="ion-trash-a"
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ cursor: 'pointer', marginLeft: '0.5rem' }}
                      ></i>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
