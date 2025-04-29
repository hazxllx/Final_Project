import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { UserContext } from "../UserContext";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setPostInfo(data);
        if (userInfo?.bookmarks?.includes(data._id)) {
          setBookmarked(true);
        }
      })
      .catch((err) => console.error("Error fetching post:", err));
  }, [id, userInfo]);

  if (!postInfo || !postInfo.author) return <div>Loading...</div>;

  const isAuthor = userInfo?.id === postInfo.author._id;

  const handleDelete = () => {
    fetch(`http://localhost:4000/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          alert("Post deleted successfully");
          navigate("/");
        } else {
          alert("Failed to delete post");
        }
      })
      .catch((err) => console.error("Error deleting post:", err));
  };

  const handleBookmark = () => {
    fetch(`http://localhost:4000/bookmark/${postInfo._id}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setBookmarked((prev) => !prev);
        } else {
          alert("Failed to update bookmark");
        }
      })
      .catch(() => alert("Bookmark action failed"));
  };

  return (
    <div className="post-page">
      <div
        className="post-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1 style={{ textAlign: "center", flex: 1 }}>{postInfo.title}</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {userInfo?.id && (
            <button
              onClick={handleBookmark}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              title="Bookmark"
            >
              <img
                src={
                  bookmarked
                    ? "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                    : "https://cdn-icons-png.flaticon.com/512/1216/1216762.png"
                }
                alt="Bookmark"
                width={24}
              />
            </button>
          )}

          {isAuthor && (
            <button
              onClick={handleDelete}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              title="Delete Post"
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/6861/6861362.png"
                alt="Delete"
                width={24}
              />
            </button>
          )}
        </div>
      </div>

      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>

      {isAuthor && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            Edit this post
          </Link>
        </div>
      )}

      <div className="image">
        <img
          src={`http://localhost:4000/${postInfo.cover}`}
          alt="Post cover"
        />
      </div>

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}
