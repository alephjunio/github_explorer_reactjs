import React, { useState, FormEvent, useEffect } from "react";
import { FiChevronRight } from "react-icons/fi";

import api from "../../services/api";

import logoImage from "../../assets/logo.svg";

import { Title, Form, Repositories, Error } from "./styles";
import { Link } from "react-router-dom";

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState("");
  const [inputError, setInputError] = useState("");
  const [repositories, setRepositories] = useState<Repository[]>(() => {
    const storageRepositories = localStorage.getItem(
      "@GithubExplorer:repositories"
    );
    return storageRepositories ? JSON.parse(storageRepositories) : [];
  });

  useEffect(() => {
    localStorage.setItem(
      "@GithubExplorer:repositories",
      JSON.stringify(repositories)
    );
  }, [repositories]);

  async function handleAddRepository(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newRepo) {
      setInputError("Digite o autor/nome do repositorio");
      return;
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`);

      const repository = response.data;

      setRepositories([...repositories, repository]);
      setNewRepo("");
      setInputError("");
    } catch (error) {
      setInputError("Repositório não encontrado");
    }
  }

  return (
    <>
      <img src={logoImage} alt="Github Explorer" />
      <Title>Explorar repositórios no Github</Title>

      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite aqui nime do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>

      {inputError && <Error>{inputError}</Error>}

      <Repositories>
        {repositories.map((repository) => (
          <Link
            key={repository.full_name}
            to={`/repository/${repository.full_name}`}
          >
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={40} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
