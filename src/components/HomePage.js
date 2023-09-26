import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "./AppContext";
import FavoriteRepos from "./FavoriteRepos";
import favoriteReposStore from "./favoriteReposStore";
import { GITHUB_API_TOKEN } from "./config";
import CopyToClipboardButton from "./CopyToClipboardButton";

function HomePage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const { searchTerm, setSearchTerm, repos, setRepos } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedRepos, setSelectedRepos] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [controller, setController] = useState(new AbortController());

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    setController(new AbortController());
  };

  const addSelectedRepo = (repo) => {
    favoriteReposStore.addRepo(repo);
    if (!selectedRepos.some((selected) => selected.id === repo.id)) {
      setSelectedRepos([...selectedRepos, repo]);
      setShowFavorites(true);
    }
  };

  const removeSelectedRepo = (repoToRemove) => {
    favoriteReposStore.removeRepo(repoToRemove);
    const updatedSelectedRepos = selectedRepos.filter(
      (repo) => repo.id !== repoToRemove.id
    );
    setSelectedRepos(updatedSelectedRepos);
  };

  useEffect(() => {
    if (searchTerm === "") {
      setRepos([]);
    } else {
      const timer = setTimeout(() => {
        setPage(1);
        loadRepositories(controller.signal);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [searchTerm, controller]);

  useEffect(() => {
    if (page > 1) {
      loadRepositories(controller.signal);
    }
  }, [page, controller]);

  const loadRepositories = (signal) => {
    if (!searchTerm.trim() || loading) {
      return;
    }

    setLoading(true);
    const headers = {
      Authorization: `Bearer ${GITHUB_API_TOKEN}`,
    };

    fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(
        searchTerm + " in:name"
      )}&page=${page}`,
      { headers, signal }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Network Error (status: ${response.status})`);
        }
        return response.json();
      })
      .then((data) => {
        const filteredRepos = data.items.filter((repo) =>
          repo.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (page === 1) {
          setRepos(filteredRepos);
        } else {
          setRepos((prevRepos) => {
            const uniqueRepos = prevRepos.filter(
              (prevRepo) =>
                !filteredRepos.some((newRepo) => newRepo.id === prevRepo.id)
            );
            return [...uniqueRepos, ...filteredRepos];
          });
        }

        setLoading(false);
        setError(null);
      })
      .catch((error) => {
        if (error.name === "AbortError") {
          console.log("Request was cancelled");
        } else if (error.response?.status === 404) {
          setError(new Error("Подробная информация отсутствует"));
        } else {
          console.error("Error:", error);
          setError(error);
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    if (page > 1) {
      loadRepositories(controller.signal);
    }
  }, [page, controller]);

  const handleCancel = () => {
    if (controller) {
      controller.abort();
    }
    setController(new AbortController());
    setPage(1);
    setRepos([]);
    setError(null);
    loadRepositories(controller.signal);
  };

  return (
    <div id="default" className="main">
      <input
        type="text"
        id="RepoSearch"
        placeholder="Enter a keyword"
        value={searchTerm}
        onChange={handleChange}
      />
      <CopyToClipboardButton text={searchTerm} />
      <button onClick={handleCancel}>Cancel</button>
      <div className="app-container">
        <div className="RepoTable" ref={scrollRef}>
          <p>Список репозиториев:</p>
          <ul className="RepoList">
            {repos.map((repo, index) => (
              <li key={`${repo.id}-${index}`}>
                <div>
                  <hr></hr>
                  <img
                    src={repo.owner.avatar_url}
                    alt={`${repo.owner.login}'s avatar`}
                    className="RepoLogo"
                    onClick={() => addSelectedRepo(repo)}
                  />
                  <p>Stars: {repo.stargazers_count}</p>
                  <p>Forks: {repo.forks_count}</p>
                  <button
                    onClick={() =>
                      navigate(`/repository/${repo.owner.login}/${repo.name}`, {
                        state: { searchTerm, repos },
                      })
                    }
                  >
                    {repo.name}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {loading && <p>Loading...</p>}
          {error && <p className="ErrorText">{error.message}</p>}
        </div>
        {showFavorites && (
          <FavoriteRepos
            selectedRepos={favoriteReposStore.selectedRepos}
            onRemove={removeSelectedRepo}
          />
        )}
      </div>
      {!loading && page < 10 && (
        <button onClick={() => setPage(page + 1)}>Load More</button>
      )}
    </div>
  );
}

export default HomePage;
