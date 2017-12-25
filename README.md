**Mapa Bairro**
=============================


Instruções:
----------------------------

- Para executar o aplicativo certifique-se de estar rodando o arquivo *index.html*
  de um servidor HTTP. Isso é necessário pois o arquivo *js/locations.js* (arquivo
  no qual estão os marcadores do mapa) é carregado durante o carregamento da página
  e se executar o arquivo *index.html* diretamente, sem ser através de um servidor
  HTTP, ocorrerá um erro de "cross origin request", pois o metodo getJSON do JQuery
  só aceita os protocolos http, https, chrome, chrome-extension e data.

- Caso não tenha nenhum servidor HTTP instalado a maneira mais fácil é através do
  servidor HTTP do python, para usá-lo siga as instruções:

  * instale o Python, instruções atrvés do [link](https://docs.python.org/3/using/windows.html#installing-python)
  * para verificar se a instalaçõa foi bem sucedida execute o comando: *python --version*
    se aparecer na tela python x.x.x (onde x.x.x é o numero da versão instalada)
    sua isntalação esta correta.
  * para executar o Http Server, se estiver no linux/mac-OS: python -m SimpleHTTPServer 8000
    no windows execute: python -m http.server 8000
  * em seguida acesse no seu navegador o endereço *http://localhost:8000* para acessar
    o aplicativo.

- Após carregar a página será exibido na tela os marcadores registrados, caso queira
  filtrar algum especifico, clique no ícone de lupa no canto superior esquerdo da tela
  para acessar o menu.

- O menu trás a lista dos marcadores que estão sendo exibidos e um campo para digitar
  a busca desejada, ao digitar algum termo os marcadores são automaticamente atualizados
  conforme o usuário vai digitando.

- Para voltar todos os marcadores apague o texto no campo de busca.

- Ao clicar em um marcador ou em um item da lista  no menu, será aberto uma **infowindow**,
  trazendo informações do wikipedia do local selecionado.
