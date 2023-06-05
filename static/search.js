document.addEventListener('DOMContentLoaded', function () {

    const frm = document.search;
    frm.addEventListener('submit', handleSearch)


    function handleSearch(event) {
        event.preventDefault(); // 폼 제출 기본 동작 방지

        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.toLowerCase()

        console.log(query)

        // 검색어가 비어있을 경우 처리
        if (query.trim() === '') {
            alert('검색어를 입력해주세요.');
            return;
        }


        // TMDB Api
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyNmM2ODZkMDdhMTcxNDUyZWUyYzM2MGUwODFjNjAxMyIsInN1YiI6IjY0NzRjMGFhNWNkMTZlMDBiZjEyNDQ2OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qgYpZS6S6GHYU8eq2rRevqoZz5g80tZ7hZ5KJ3soHVU'
            }
        };
        const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';

        fetch(url, options)
            .then(response => response.json())
            .then(data => {
                const searchResults = data['results'];
                // 전체 데이터 들 제목을 소문자로 변환
                let titleList = searchResults.map((item) => {
                    return item.title.toLowerCase()
                })
                // query검색어와  위에 값이 포함 되어 있는 타이틀 반환
                let find_title = titleList.filter((item) =>{
                    return item.includes(query)
                }) ;
                
                // 전체 타이틀 리스트에서 일치하는 타이틀의 인덱스 번호 찾기
                let find_index = []

                for (let i in find_title){
                    let idx = titleList.findIndex((item) => {

                        return item === find_title[i]
                    });

                    find_index.push(idx);
                }

                // 값이 없으면 -> alert , 
                if (find_index.length === 0) {
                    alert('검색 결과가 없습니다.');
                // 값이 있으면 ->     
                } else {
                    const cardList = document.querySelector('.cardList');
                    // 전체 데이터에서 일치한 데이터 뽑아오기 

                    const match_movie = []
                    for (let a of find_index) {
                        const movies = searchResults[a];
                        match_movie.push(movies);
                    }
                
                    cardList.innerHTML = '';
                    // 채워넣기
                    match_movie.forEach((result) => {
                        const title = result['title'];
                        const overview = result['overview'];
                        const posterPath = result['poster_path'];
                        const voteAverage = result['vote_average'];
                        const id = result['id'];

                        const temp_html = `
                    <div class="movie-card" data-id="${id}">
                        <img src="https://image.tmdb.org/t/p/w500${posterPath}">
                        <h3>${title}</h3>
                        <p>${overview}</p>
                        <p>Rating: ${voteAverage}</p>
                    </div>
                `;
                        cardList.insertAdjacentHTML('beforeend', temp_html);
                    });
                }
            })
            .catch(err => console.error(err));
    };
});