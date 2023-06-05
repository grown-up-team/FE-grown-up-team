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
                        <div class="movie-card" data-id="${_id}">
                            <img src="https://image.tmdb.org/t/p/w500${_poster_path}">
                            <h3 class ="info-title">${_title}</h3>
                            <p class ="info-overview">${_overview}</p>
                            <p class ="info-vote_average">Rating: ${_vote_average}</p>
                        </div>
                    `;
                    cardList.insertAdjacentHTML('beforeend', temp_html);
                });

                // 클릭 이벤트 핸들러 추가 -> alert id
                const movieCards = document.querySelectorAll('.movie-card'); // :CSS 선택자를 이용하여 모든 요소를 선택합니다.
                movieCards.forEach(card => {
                    card.addEventListener('click', function () {
                        let movieId = this.getAttribute('data-id'); // : 해당 요소의 속성 값을 가져옵니다.
                        alert(`영화 id: ${movieId}`);
                    });
                });

                $('.movie-card').click(function () {
                    let detail_modal = $('.detail-overlay');

                    let id = $(this).data('num');

                    $('#overlay').attr('data-id', id);

                    let all_id = rows.map(rows => rows['_id']);

                    let indexNum = $.inArray(id, all_id);

                    let this_data = rows[indexNum];

                    let $title = this_data['title'];
                    let $overview = this_data['overview'];
                    let $poster_path = this_data['poster_path'];
                    let $vote_average = this_data['vote_average'];
                    let _id = this_data['num'];

                    $('.movie-card img').attr('src', $poster_path);
                    $('.info-title').text($title);
                    $('.info-overview').text($overview);
                    $('.info-vote_average').text($vote_average);

                    detail_modal.css({
                        display: 'block'
                    });
                });
            })
            .catch(err => console.error(err));
    }
});
