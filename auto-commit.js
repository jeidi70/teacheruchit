const { exec } = require('child_process');
const chokidar = require('chokidar');

// Игнорируемые директории и файлы
const ignored = [
    'node_modules',
    '.git',
    '*.log',
    'package-lock.json'
];

// Функция для выполнения git команд
function runGitCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`Stderr: ${stderr}`);
            }
            console.log(`Stdout: ${stdout}`);
            resolve(stdout);
        });
    });
}

// Функция для создания коммита
async function createCommit() {
    try {
        // Добавляем все изменения
        await runGitCommand('git add .');
        
        // Создаем коммит с текущей датой и временем
        const date = new Date().toLocaleString();
        await runGitCommand(`git commit -m "Auto commit: ${date}"`);
        
        // Отправляем изменения на GitHub
        await runGitCommand('git push origin main');
        
        console.log('Changes committed and pushed successfully');
    } catch (error) {
        console.error('Error during commit:', error);
    }
}

// Настраиваем наблюдатель за изменениями
const watcher = chokidar.watch('.', {
    ignored: ignored,
    persistent: true,
    ignoreInitial: true
});

// Обработчики событий
watcher
    .on('add', path => {
        console.log(`File ${path} has been added`);
        createCommit();
    })
    .on('change', path => {
        console.log(`File ${path} has been changed`);
        createCommit();
    })
    .on('unlink', path => {
        console.log(`File ${path} has been removed`);
        createCommit();
    });

console.log('Watching for changes...'); 