document.addEventListener('DOMContentLoaded', function () {
  // 스크립트가 최상단에 있기 때문에, html 모든 요소가 파싱되고, 로드된 후에 이벤트를 발생 시키기 위함.
  searchMovies();

  function searchMovies() {
    // TMDB Api
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization:
          'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNmM2ODZkMDdhMTcxNDUyZWUyYzM2MGUwODFjNjAxMyIsInN1YiI6IjY0NzRjMGFhNWNkMTZlMDBiZjEyNDQ2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qgYpZS6S6GHYU8eq2rRevqoZz5g80tZ7hZ5KJ3soHVU'
      }
    };
    const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';

    // api 데이터 긇어오기
    fetch(url, options)
      .then(response => response.json())
      .then(data => {
        let rows = data['results'];
        const cardList = document.querySelector('.cardList');
        cardList.innerHTML = '';

        console.log(data);
        rows.forEach(a => {
          let _title = a['title'];
          let _overview = a['overview'];
          let _poster_path = a['poster_path'];
          let _vote_average = a['vote_average'];
          let _id = a['id'];

          let temp_html = `
                            <div class="movie-card" data-id="${_id}" onclick="goToServePage('${_id}')">
                            <img src="https://image.tmdb.org/t/p/w500${_poster_path}">
                            <h3 class="info-title">${_title}</h3>
                            <p class="info-vote_average">Rating: ${_vote_average}</p>
                        </div>
                    `;
          cardList.insertAdjacentHTML('beforeend', temp_html);
        });

        function goToServePage(urlID) {
          // http://127.0.0.1:5501/templates/detail.html
          const serveurl = `detail.html?movieID=${urlID}`;
          location.href = serveurl;
          console.log(serveurl);
        }

        // 클릭 이벤트 핸들러 추가 -> alert id
        const movieCards = document.querySelectorAll('.movie-card'); // :CSS 선택자를 이용하여 모든 요소를 선택합니다.
        movieCards.forEach(card => {
          card.addEventListener('click', function () {
            let targetId = this.getAttribute('data-id'); // : 해당 요소의 속성 값을 가져옵니다.
            // alert(`영화 id: ${movieId}`);
            // goToServePage(movieId);

            // const targetId = e.target.closest("li").dataset.id;

            let url = new URL(window.location.href);
            // let url = new URL("https://127.0.0.1:5000/");

            // openModal(targetMovie);
            // window.location.href = url + "detail" + "#" + targetId;

            let formData = new FormData();
            formData.append('movieId', targetId);

            fetch('/detail', { method: 'POST', body: formData })
              .then(res => res.json())
              .then(data => {
                console.log(data);
              });

            window.location.href = url + 'detail/' + targetId;
          });
        });
      })
      .catch(err => console.error(err));
  }
});
