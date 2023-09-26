import { makeAutoObservable } from "mobx";

class FavoriteReposStore {
  selectedRepos = [];

  constructor() {
    makeAutoObservable(this);
  }

  addRepo(repo) {
    if (!this.selectedRepos.some((selected) => selected.id === repo.id)) {
      this.selectedRepos.push(repo);
    }
  }

  removeRepo(repoToRemove) {
    this.selectedRepos = this.selectedRepos.filter(
      (repo) => repo.id !== repoToRemove.id
    );
  }
}

const favoriteReposStore = new FavoriteReposStore();

export default favoriteReposStore;
