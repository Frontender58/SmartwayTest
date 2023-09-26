import React, { useState, useEffect } from "react";

function FavoriteRepos({ selectedRepos, onRemove }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(selectedRepos.length > 0);
  }, [selectedRepos]);

  const handleLogoClick = () => {
    if (selectedRepos.length === 0) {
      return;
    }

    setExpanded(!expanded);
  };

  return (
    <div className={`FavoriteRepos${expanded ? " expanded" : ""}`}>
      {selectedRepos.length > 0 && (
        <p onClick={handleLogoClick}>Список с избранными репозиториями</p>
      )}
      {selectedRepos.length > 0
        ? selectedRepos.map((repo) => (
            <div key={repo.id}>
              <img
                src={repo.owner?.avatar_url}
                alt={`${repo.owner?.login}'s avatar`}
                className="RepoLogo"
                onClick={() => onRemove(repo)}
              />
              <p>Stars: {repo.stargazers_count}</p>
              <p>Forks: {repo.forks_count}</p>
            </div>
          ))
        : null}
    </div>
  );
}

export default FavoriteRepos;
