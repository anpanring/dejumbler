export function changeMode() {
    let color;
    document.documentElement.getAttribute('data-theme') === 'dark'
        ? color = 'light'
        : color = 'dark';
    document.documentElement.setAttribute('data-theme', color);
    return color;
}