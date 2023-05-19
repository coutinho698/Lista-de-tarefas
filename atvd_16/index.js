// Seleciona elementos do DOM
const lista = document.getElementById("lista");
const inputDescricao = document.getElementById("inputDescricao");
const btAdd = document.getElementById("btAdd");

// URL e cabeçalhos para requisições
const taskUrl = "https://parseapi.back4app.com/classes/Task";
const headers = {
  "X-Parse-Application-Id": "RkjwBkfNZRERi3k4FVjojkTgLLe6CbbTPbW4qrQo",
  "X-Parse-REST-API-Key": "wmn69SVNaLq6UoW177InOj1tnXUsy2fkfvtHagdu",
};

// Função para renderizar a lista de tarefas
const renderizaLista = (tarefas) => {
  lista.innerHTML = "";
  tarefas.forEach((tarefa) => {
    const listItem = document.createElement("li");
    listItem.classList.add("task-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.done;
    checkbox.onchange = () => atualizaTarefa(tarefa, checkbox.checked);
    listItem.appendChild(checkbox);

    const descriptionText = document.createElement("span");
    descriptionText.textContent = tarefa.description;
    if (tarefa.done) {
      descriptionText.classList.add("task-done");
    }
    listItem.appendChild(descriptionText);

    lista.appendChild(listItem);
  });
};

// Função para obter as tarefas da API
const obterTarefas = async () => {
  try {
    const res = await fetch(taskUrl, { headers });
    const data = await res.json();
    renderizaLista(data.results);
  } catch (err) {
    console.log(err);
  }
};

// Função para lidar com o clique no botão de adicionar tarefa
const lidarComClique = async () => {
  const descricao = inputDescricao.value;
  if (!descricao) {
    alert("Por favor, digite uma descrição!");
    return;
  }
  btAdd.disabled = true;
  try {
    const res = await fetch(taskUrl, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: descricao }),
    });
    const data = await res.json();
    obterTarefas();
    btAdd.disabled = false;
    inputDescricao.value = "";
    inputDescricao.focus();
    console.log("data", data);
  } catch (err) {
    btAdd.disabled = false;
    console.log(err);
  }
};

// Função para atualizar o estado de uma tarefa
const atualizaTarefa = async (tarefa, concluida) => {
  try {
    const res = await fetch(`${taskUrl}/${tarefa.objectId}`, {
      method: "PUT",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ done: concluida }),
    });
    const data = await res.json();
    obterTarefas();
    console.log("data", data);
  } catch (err) {
    console.log(err);
  }
};

// Inicialização da página
obterTarefas();
btAdd.onclick = lidarComClique;
