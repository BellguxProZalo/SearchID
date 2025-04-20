const searchForm = document.getElementById('searchForm');
const searchInput = document.querySelector('.search-input');
const resultsContainer = document.querySelector('.results-container');

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const query = searchInput.value.trim();
    if (!query) return;

    resultsContainer.innerHTML = '<p>Đang tìm kiếm...</p>';

    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `query=${encodeURIComponent(query)}`,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayResults(data.data); // Dữ liệu kết quả từ Flask
    } catch (error) {
        console.error('Lỗi khi gửi yêu cầu tìm kiếm:', error);
        resultsContainer.innerHTML = '<p>Có lỗi xảy ra khi tìm kiếm.</p>';
    }
});

function displayResults(results) {
    resultsContainer.innerHTML = '';
    if (results && results.length > 0) {
        results.forEach(result => {
            const url = result[0];
            const title = result[1];

            const resultItem = document.createElement('div');
            resultItem.classList.add('result-item');

            const titleLink = document.createElement('a');
            titleLink.href = url;
            titleLink.classList.add('result-title');
            titleLink.textContent = title || 'Không có tiêu đề';

            const urlLink = document.createElement('a');
            urlLink.href = url;
            urlLink.classList.add('result-url');
            urlLink.textContent = url;

            resultItem.appendChild(titleLink);
            resultItem.appendChild(document.createElement('br'));
            resultItem.appendChild(urlLink);
            resultsContainer.appendChild(resultItem);
        });
    } else {
        resultsContainer.innerHTML = '<p>Không tìm thấy kết quả nào.</p>';
    }
}