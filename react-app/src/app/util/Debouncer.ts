export type DebouncedFunction<F extends (...args: any[]) => any> = (...args: Parameters<F>) => void;

export function debounce<F extends (...args: any[]) => any>(func: F, delay: number): DebouncedFunction<F> {
    let timeoutId: ReturnType<typeof setTimeout>;

        return function (this: ThisParameterType<F>, ...args: Parameters<F>): void {
        const context = this;

        clearTimeout(timeoutId);

        timeoutId = setTimeout(function () {
            func.apply(context, args);
        }, delay);
    };
}