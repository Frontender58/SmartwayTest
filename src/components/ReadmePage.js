import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

function ReadmePage() {
  const { owner, repo } = useParams();
  const [readmeContent, setReadmeContent] = useState("");
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!owner || !repo) {
      return;
    }

    fetchReadme(owner, repo);
  }, [owner, repo]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const fetchReadme = (owner, repo) => {
    fetch(
      `https://api.github.com/repos/${encodeURIComponent(
        owner
      )}/${encodeURIComponent(repo)}/readme`
    )
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            setReadmeContent("Подробная информация отсутствует");
          } else if (response.status === 403) {
            setReadmeContent("Недостаточно прав доступа");
          } else {
            throw new Error(`Network Error (status: ${response.status})`);
          }
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.content) {
          try {
            const readmeBase64 = data.content;
            const readmeText = atob(readmeBase64);
            setReadmeContent(readmeText);
          } catch (error) {
            console.error("Error decoding readme data:", error);
            setError(error);
          }
        } else {
          setReadmeContent("Подробная информация отсутствует");
        }
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Request was cancelled");
        } else {
          console.error("Error fetching readme data:", error);
          setError(error);
        }
      });
  };

  return (
    <div className="ReadmePage">
      <Link to="/" onClick={() => navigate(-1)}>
        <button>Back</button>
      </Link>{" "}
      <h2>
        Repository: {owner}/{repo}
      </h2>
      {error ? (
        <p className="ErrorText">Подробная информация отсутствует</p>
      ) : (
        <div>
          <div>
            <h3>Readme</h3>
            <pre>{readmeContent}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReadmePage;
