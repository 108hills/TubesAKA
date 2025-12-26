// Cursor tracking untuk background effect
document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
});

// Generate data rating random
function generateRatings(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * 15) + 1);
    }
    return arr;
}

// Selection Sort (Iteratif)
function selectionSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
}

// Quick Sort (Rekursif)
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    let pivot = arr[Math.floor(arr.length / 2)];
    let left = arr.filter(x => x < pivot);
    let mid = arr.filter(x => x === pivot);
    let right = arr.filter(x => x > pivot);
    return [...quickSort(left), ...mid, ...quickSort(right)];
}

// Tampilkan data ke tabel
function tampilkanData(arr, tableId) {
    let table = document.getElementById(tableId);
    table.innerHTML = "";

    arr.forEach((val, i) => {
        let row = `<tr>
                    <td>${i + 1}</td>
                    <td>${val}</td>
                   </tr>`;
        table.innerHTML += row;
    });
}

// Proses utama
function proses() {
    let n = parseInt(document.getElementById("n").value);
    if (!n || n <= 0) {
        alert("Masukkan N yang valid");
        return;
    }

    let data = generateRatings(n);
    tampilkanData(data, "dataTable");

    let dataSelection = [...data];
    let dataQuick = [...data];

    // Jalankan banyak iterasi untuk akurasi waktu (terutama pada dataset kecil)
    const iterations = 1000;
    
    // Selection Sort timing
    let start = performance.now();
    for (let i = 0; i < iterations; i++) {
        let tempData = [...data];
        selectionSort(tempData);
    }
    let selectionTime = (performance.now() - start) / iterations;

    // Quick Sort timing
    start = performance.now();
    for (let i = 0; i < iterations; i++) {
        quickSort([...data]);
    }
    let quickTime = (performance.now() - start) / iterations;

    // Sort the actual data for display
    selectionSort(dataSelection);
    dataQuick = quickSort(dataQuick);

    // Tampilkan hasil sorting
    tampilkanData(dataSelection, "selectionSortTable");
    tampilkanData(dataQuick, "quickSortTable");

    document.getElementById("selection").innerText =
        `Selection Sort : ${selectionTime.toFixed(4)} ms`;

    document.getElementById("quick").innerText =
        `Quick Sort : ${quickTime.toFixed(4)} ms`;
}
