export const noteOffsetPosition = (note: string) => {
    const trimmedName: string = note.length === 3 ? note.substring(0,2) : note.substring(0,1);
    console.log(trimmedName);
    switch (trimmedName) {
        case 'A': return 12;
        case 'B': return 12;
        case 'C': return 0;
        case 'D': return 12;
        case 'E': return 12;
        case 'F': return 0;
        case 'G': return 12;
        default: return 12;
    }
}

export const noteWidth = (note: string) => {
    const trimmedName: string = note.length === 3 ? note.substring(0,2) : note.substring(0,1);
    console.log(trimmedName);
    switch (trimmedName) {
        case 'A': return 25;
        case 'B': return 38;
        case 'C': return 38;
        case 'D': return 25;
        case 'E': return 38;
        case 'F': return 38;
        case 'G': return 25;
        default: return 25;
    }
}