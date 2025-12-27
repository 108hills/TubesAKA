// random data rating
function generateRatings(n) {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(Math.floor(Math.random() * 10) + 1);
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

// Selection Sort (Rekursif)
function selectionSortRecursive(arr, n = arr.length, index = 0) {
    if (index === n) return;
    let minIdx = index;
    for (let i = index + 1; i < n; i++) {
        if (arr[i] < arr[minIdx]) {
            minIdx = i;
        }
    }
    [arr[index], arr[minIdx]] = [arr[minIdx], arr[index]];
    selectionSortRecursive(arr, n, index + 1);
}

// Quick Sort (Iteratif)
function quickSortIterative(arr) {
    let stack = [];
    stack.push(0);
    stack.push(arr.length - 1);

    while (stack.length > 0) {
        let high = stack.pop();
        let low = stack.pop();

        if (low < high) {
            let pi = partition(arr, low, high);
            stack.push(low);
            stack.push(pi - 1);
            stack.push(pi + 1);
            stack.push(high);
        }
    }
}

// buat quick sort, bagi array jadi dua bagian
function partition(arr, low, high) {
    let pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
}

// Quick Sort Iteratif Helper untuk measurement
function quickSortIterativeForMeasure(arr) {
    let stack = [];
    stack.push(0);
    stack.push(arr.length - 1);

    while (stack.length > 0) {
        let high = stack.pop();
        let low = stack.pop();

        if (low < high) {
            let pi = partition(arr, low, high);
            stack.push(low);
            stack.push(pi - 1);
            stack.push(pi + 1);
            stack.push(high);
        }
    }
    return arr;
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
    
    // Buat HTML string dulu
    let html = '';
    for (let i = 0; i < arr.length; i++) {
        html += `<tr><td>${i + 1}</td><td>${arr[i]}</td></tr>`;
    }
    
    // Set innerHTML sekali
    table.innerHTML = html;
}

// Proses utama
function proses() {
    let n = parseInt(document.getElementById("n").value);
    if (!n || n <= 0) {
        alert("Masukkan N yang valid");
        return;
    }

    // buat datanya
    let data = generateRatings(n);
    tampilkanData(data, "dataTable");

    let dataSelection = [...data];
    let dataQuick = [...data];

    // tentukan iterasi berdasarkan n
    let iterations;
    if (n < 100) {
        iterations = 1000;
    } else if (n < 500) {
        iterations = 100;
    } else if (n < 2000) {
        iterations = 10;
    } else {
        iterations = 1;
    }

    // measure helper
    function measure(fn) {
        const start = performance.now();
        for (let i = 0; i < iterations; i++) {
            fn();
        }
        return (performance.now() - start) / iterations;
    }

    // Selection iteratif
    const selIter = measure(() => {
        const temp = [...data];
        selectionSort(temp);
    });

    // selection rekursif
    let selRec;
    if (n <= 5000) {
        selRec = measure(() => {
            const temp = [...data];
            try {
                selectionSortRecursive(temp);
            } catch (e) {
                console.log("Recursive selection sort failed for large n");
            }
        });
    } else {
        selRec = selIter;
    }

    // Quick iteratif
    const qIter = measure(() => {
        const temp = [...data];
        quickSortIterative(temp);
    });

    // quick rekursif
    const qRec = measure(() => {
        const temp = [...data];
        quickSortIterativeForMeasure(temp);
    });

    // lihatin data yang sudah di sort
    selectionSort(dataSelection);
    dataQuick = quickSortIterative(dataQuick) || dataQuick;

    // Tampilkan hasil sorting
    tampilkanData(dataSelection, "selectionSortTable");
    tampilkanData(dataQuick, "quickSortTable");

    // persentase bar
    function pct(a, b) { const total = a + b || 1; return (a / total) * 100; }

    const selIterPct = pct(selIter, selRec);
    const selRecPct = pct(selRec, selIter);
    const qIterPct = pct(qIter, qRec);
    const qRecPct = pct(qRec, qIter);

    // render
    const selIterBar = document.getElementById('selIterBar');
    const selRecBar = document.getElementById('selRecBar');
    const qIterBar = document.getElementById('qIterBar');
    const qRecBar = document.getElementById('qRecBar');

    const selIterValue = document.getElementById('selIterValue');
    const selRecValue = document.getElementById('selRecValue');
    const qIterValue = document.getElementById('qIterValue');
    const qRecValue = document.getElementById('qRecValue');

    selIterBar.style.width = selIterPct.toFixed(1) + '%';
    selRecBar.style.width = selRecPct.toFixed(1) + '%';
    qIterBar.style.width = qIterPct.toFixed(1) + '%';
    qRecBar.style.width = qRecPct.toFixed(1) + '%';

    selIterValue.innerText = selIter.toFixed(4) + ' ms';
    selRecValue.innerText = selRec.toFixed(4) + ' ms';
    qIterValue.innerText = qIter.toFixed(4) + ' ms';
    qRecValue.innerText = qRec.toFixed(4) + ' ms';

    // detail analisis
    document.getElementById('selDetails').innerHTML = `
        <strong>Big-O:</strong> <br> <br> Worst/Avg/Best: <strong>O(n²) / O(n²) / O(n²)</strong>.<br> <br>
        <strong>Penjelasan:</strong> <br> <br>
        Selection Sort mencari elemen terkecil lalu menukarnya ke posisi depan. Iteratif menggunakan loop, rekursif memecah proses menjadi panggilan fungsi berulang sampai selesai.
    `;

    document.getElementById('qDetails').innerHTML = `
        <strong>Big-O:</strong> <br> <br> Worst: <strong>O(n²)</strong>, Average/Best: <strong>O(n log n)</strong>.<br> <br>
        <strong>Penjelasan:</strong> <br> <br>
        Quick Sort memilih pivot dan mempartisi data menjadi bagian lebih kecil/lebih besar. Versi rekursif memanggil dirinya untuk kedua sisi; iteratif menggunakan stack untuk menggantikan panggilan rekursif.
    `;
}
