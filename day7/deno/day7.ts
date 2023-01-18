type File = {
    name: string;
    size: number;
};

type Folder = {
    name: string;
    folders: Folder[];
    files: File[];
}

type CalculatedFolder = {
    name: string;
    folders: CalculatedFolder[];
    files: File[];
    sum: number;
}

function readFile(fileName: string): Promise<string> {
    return Deno.readTextFile(fileName);
}

function printDir(dir: string[]): string {
    return '/' + dir.join('/');
}

function parseFolder(input: string): Folder {
    const lines = input.split('\n');
    let currentDir: string[] = [];
    let mode: 'COMMAND' | 'LIST' = 'COMMAND';
    const rootDir: Folder = {
        name: 'root',
        folders: [],
        files: []
    };
    let currentLevel = rootDir;

    lines.forEach(line => {
        console.log('line: ' + line);
        if (line.startsWith('$ cd ')) {
            const dirToJumpTo = line.substring('$ cd '.length);
            if (dirToJumpTo == '/') {
                currentDir = [];
            } else if (dirToJumpTo == '..') {
                currentDir.pop();
            } else {
                currentDir.push(dirToJumpTo);
            }
            currentLevel = rootDir;
            currentDir.forEach(subDir => {
                let folderFound = currentLevel.folders.find(f => f.name === subDir);
                if (!folderFound) {
                    folderFound = { name: subDir, folders: [], files: []};
                    currentLevel.folders.push(folderFound);
                }
                currentLevel = folderFound;
            });
            mode = 'COMMAND';
            console.log(`Switched to ${printDir(currentDir)}`);
        } else if (line.startsWith('$ ls')) {
            mode = 'LIST';
            console.log(`Switched to LIST-mode`);
        } else if (line.startsWith('dir ')) {
            if (mode != 'LIST') {
                throw new Error('Output "dir" when not in LIST-mode');
            }
            const dir = line.substring('dir '.length);
            currentLevel.folders.push({ name: dir, folders: [], files: []});
            console.log(`Subdir in ${currentDir}: ${dir}`);
        } else {
            const regex = /(?<size>\d+) (?<fileName>[a-z.]+)/;
            const match = line.match(regex);
            if (!match) {
                throw new Error('Unexpected line: ' + line);
            }
            if (mode != 'LIST') {
                throw new Error('Output "file" when not in LIST-mode');
            }
            if (!match.groups) {
                throw new Error('No groups found');
            }
            const size = parseInt(match.groups['size']);
            const fileName = match.groups['fileName'];
            currentLevel.files.push({ name: fileName, size: size });
            console.log(`File in ${currentDir}: ${fileName} (${size})`);
        }
        console.log(`[State] mode: ${mode}, currentDir: ${printDir(currentDir)}, currentLevel: ${JSON.stringify(currentLevel)}`);
        console.log();
    });

    return rootDir;
}

function calculateSums(folder: Folder): CalculatedFolder {
    const calculatedSubFoldes: CalculatedFolder[] = folder.folders.map(subFolder => calculateSums(subFolder));
    const filesSum = folder.files
        .map(file => file.size)
        .reduce((a, b) => a + b, 0);
    const foldersSum = calculatedSubFoldes
        .map(f => f.sum as number)
        .reduce((a, b) => a + b, 0);
    return {
        ...folder,
        folders: calculatedSubFoldes,
        sum: filesSum + foldersSum,
    }
}

function part1(root: CalculatedFolder): number {
    const subCount = root.folders
        .map(subFolder => part1(subFolder))
        .reduce((a, b) => a + b, 0);
    const ownCount = root.sum <= 100000 ? root.sum : 0;
    return subCount + ownCount;
}

function part2(root: CalculatedFolder): number {
    const spaceAvailable = 70_000_000;
    const spaceNeeded = 30_000_000;
    const spaceFree = spaceAvailable - root.sum;
    const spaceToBeFreed = Math.max(spaceNeeded - spaceFree, 0);
    const sumsOfFolder = (folder: CalculatedFolder): number[] => {
        const subSums = folder.folders.map(subFolder => sumsOfFolder(subFolder)).flat();
        return [...subSums, folder.sum];
    }
    return sumsOfFolder(root)
        .filter(s => s >= spaceToBeFreed)
        .sort((a, b) => a - b)[0];
}

console.log(`Part 1: ${part1(calculateSums(parseFolder(await readFile('input.txt'))))}`);
console.log(`Part 2: ${part2(calculateSums(parseFolder(await readFile('input.txt'))))}`);
