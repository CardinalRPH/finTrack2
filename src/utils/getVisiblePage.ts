const getVisiblePages = (current: number, total: number) => {
    if (total <= 3) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    let start: number;

    if (current === 1) {
        start = 1;
    }

    else if (current === total) {
        start = total - 2;
    }
    else {
        start = current - 1;
    }
    start = Math.max(1, Math.min(start, total - 2));

    return [start, start + 1, start + 2];
};

export default getVisiblePages