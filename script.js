'use strict';

//Initializing Variables
let array = [];
const barComponent = document.getElementById('bar-component');
const newArrayBtn = document.getElementById('new-array');

//Sliders
const speedSlider = document.getElementById('speed');
const barSlider = document.getElementById('bar-slider');

//Sorting Buttons
const bubbleSortBtn = document.getElementById('bubble-sort');
const selectionSortBtn = document.getElementById('selection-sort');
const mergeSortBtn = document.getElementById('merge-sort');
const quickSortBtn = document.getElementById('quick-sort');

// Couple of booleans to manage the state of the visualize
let isSorting = false;


barSlider.addEventListener('input', function () {
    init(Number(barSlider.value));
    toggleButton("none");
});

// Helper function to normalise the values.
function normalize(x, a = 30, b = 300, min = 1, max = 100) {

    return ((b - a) * ((x - min) / (max - min))) + a;
}


function createbar(normalizedHeight, color = "yellow") {
    const bar = document.createElement("div");
    bar.setAttribute('class', 'bar')
    bar.style.borderLeft = `${color} 3px solid`;
    bar.style.marginRight = "4px";
    bar.style.height = normalizedHeight + "px";
    return bar;
}

function init(len) {
    while (barComponent.firstChild) barComponent.removeChild(barComponent.firstChild);
    for (let i = 1; i <= len; i++) {
        let random = Math.trunc(Math.random() * 100) + 1;
        array.push(random);
    }

    for (let i = 0; i < len; i++) {
        let normalisedHeight = normalize(array[i]);
        let bar = createbar(normalisedHeight);
        bar.setAttribute('id', i)
        barComponent.appendChild(bar);
    }
}

// Remove all 'active' from button and adds the the same class to the  desired button except for none 
// which is used for bar slider
function toggleButton(button) {
    bubbleSortBtn.classList.remove('active');
    selectionSortBtn.classList.remove('active');
    mergeSortBtn.classList.remove('active');
    quickSortBtn.classList.remove('active');

    if (button !== "none")
        button.classList.add('active');
}

function disableEnableBarRange(isSorting) {
    if (isSorting) barSlider.disabled = true;
    else barSlider.disabled = false;
}

/*--------------------------------------------------Sorting Algorithms -------------------------------------------------------------- */

/*-------------------------------- Helper Functions -------------------------------- */

// Swap Values and changes border color to red
function swap(bar1, bar2) {
    let val1 = toNumber(bar1);
    let val2 = toNumber(bar2);

    bar1.style.height = val2 + "px";
    bar2.style.height = val1 + "px";
    bar1.style.borderColor = '#FF0000';
    bar2.style.borderColor = '#FF0000';
}

// Changes the border color back to yellow after swapping
function changeBackToYellow(bar1, bar2) {
    bar1.style.borderColor = '#FFFF00';
    bar2.style.borderColor = '#FFFF00';
}

// Gets the numeric height values from div (veticle line (border-line))
function toNumber(bar) {
    let barCSS = bar.style.height;
    return Number(barCSS.substring(0, barCSS.length - 2));
}

// Changes the border color to color to indicate the sorted values
function toColor(bar, color) {
    bar.style.borderColor = color;
}

// Gets the array of heights of the bars
function barsArray() {
    const bars = document.getElementsByClassName('bar');
    let barsArr = []
    for (let i = 0; i < bars.length; i++) barsArr.push(toNumber(bars[i]));
    return barsArr;
}

// timeout function for async function
function timeout(ms = 600 - speedSlider.value) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*-------------------------------- Helper Functions -------------------------------- */



// Bubble Sort
async function bubbleSort() {
    toggleButton(bubbleSortBtn);
    const bars = document.getElementsByClassName('bar');
    const len = bars.length;
    let k = len - 1;

    for (let i = 0; i < len - 1; i++) {
        for (let j = 0; j < len - 1 - i; j++) {

            // Nothing to do with sorting
            // Just to manage the state of Number of bar slider
            disableEnableBarRange(isSorting = true);

            let val1 = toNumber(bars[j]);
            let val2 = toNumber(bars[j + 1]);

            if (val1 > val2)
                swap(bars[j], bars[j + 1]);

            await timeout();


            changeBackToYellow(bars[j], bars[j + 1]);
        }
        //Changes the borderColor to green
        toColor(bars[k--], "#00FF00");
    }

    // Nothing to do with sorting
    // Just to manage the state of Number of bar slider
    disableEnableBarRange(isSorting = false);
}

// Selection Sort
async function selectionSort() {
    toggleButton(selectionSortBtn);
    const bars = document.getElementsByClassName('bar');
    const len = bars.length;
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < len; j++) {
            let val1 = toNumber(bars[minIndex]);
            let val2 = toNumber(bars[j]);

            // Nothing to do with sorting
            // Just to manage the state of Number of bar slider
            disableEnableBarRange(isSorting = true);

            if (val1 > val2) minIndex = j;
        }
        swap(bars[i], bars[minIndex]);

        await timeout();

        changeBackToYellow(bars[i], bars[minIndex]);
        toColor(bars[i], "#00FF00");
    }

    // Nothing to do with sorting
    // Just to manage the state of Number of bar slider
    disableEnableBarRange(isSorting = false);
}

// Merge Sort
function mergeSort() {
    toggleButton(mergeSortBtn);
    const arr = barsArray();
    const bars = document.getElementsByClassName('bar');
    console.log(arr);
    const temp = [], seen = [];
    let len = arr.length;

    for (let i = 0; i < len; i++) {
        temp.push(parseInt(0)); seen.push(parseInt(0));
    }

    function draw(start, end) {
        while (barComponent.firstChild) barComponent.removeChild(barComponent.firstChild);
        for (let i = 0; i < len; i++) {
            let bar = createbar(arr[i]);
            barComponent.appendChild(bar);
            if (seen[i] !== 0) {
                toColor(bar, "#00FF00");
            }
        }
        for (let i = start; i < end; i++) {
            toColor(bars[i], "#FF0000");
            seen[i] = 1;
        }
    }

    function merge(start, end) {
        let mid = parseInt((start + end) / 2);
        let start1 = start, start2 = mid + 1;
        let end1 = mid, end2 = end;

        disableEnableBarRange(isSorting = true);

        let index = start;

        while (start1 <= end1 && start2 <= end2) {
            if (arr[start1] <= arr[start2]) temp[index++] = arr[start1++];
            else temp[index++] = arr[start2++];
        }
        while (start1 <= end1) temp[index++] = arr[start1++];
        while (start2 <= end2) temp[index++] = arr[start2++];

        index = start;
        while (index <= end) arr[index] = temp[index++];
    }

    async function sort(start, end) {
        if (start < end) {
            let mid = parseInt((start + end) / 2);
            await sort(start, mid);
            await sort(mid + 1, end);
            merge(start, end);
            draw(start, end);
            await timeout();
        }
    }

    async function execute() {
        await sort(0, len - 1);
        await draw();
        disableEnableBarRange(isSorting = false);
    }
    execute();
}

// QuickSort
function quickSort() {

}

/*--------------------------------------------------Sorting Algorithms -------------------------------------------------------------- */

// initializes the bars, arrays and stuff
init(Number(barSlider.value))


// All the event listeners are present here
// When the user clicks the new-array button
newArrayBtn.addEventListener('click', function () {
    location.reload();
});

//When the user clicks on Bubble Sort button
bubbleSortBtn.addEventListener('click', bubbleSort);

//When the user clicks on Bubble Sort button
selectionSortBtn.addEventListener('click', selectionSort);

// mergeSort();
mergeSortBtn.addEventListener('click', mergeSort);

