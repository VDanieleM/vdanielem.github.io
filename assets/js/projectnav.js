document.addEventListener('DOMContentLoaded', () => {
    // 1. Nomi esatti dei file presenti dentro la cartella /projects/
    const projects = [
        { file: 'projectkorumana.html', title: 'Koru Mana' },
        { file: 'projectmedianorba.html', title: 'Medianorba' },
        { file: 'projectmareterre.html', title: 'Mareterre' },
        { file: 'projectlaquercia.html', title: 'La Quercia Natura & Relax' },
        { file: 'projectclaudialiuzzi.html', title: 'Claudia Liuzzi' },
        { file: 'projectstudiointerno10.html', title: 'Studio Interno 10' }
    ];

    // 2. Estrazione sicura del file corrente dall'URL
    const pathParts = window.location.pathname.split('/');
    const currentFile = pathParts[pathParts.length - 1].toLowerCase();

    console.log('[Nav] File rilevato nella pagina:', currentFile);

    // 3. Ricerca nell'indice
    const currentIndex = projects.findIndex(p => p.file.toLowerCase() === currentFile);

    if (currentIndex === -1) {
        console.warn('[Nav] Il file corrente non è presente nella lista projects:', currentFile);
        return;
    }

    // 4. Calcolo progetti precedente e successivo
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    const nextIndex = (currentIndex + 1) % projects.length;

    const prevBtn = document.querySelector('.btn-circle.prev');
    const nextBtn = document.querySelector('.btn-circle.next');

    if (prevBtn) {
        prevBtn.href = projects[prevIndex].file;
        prevBtn.setAttribute('title', `Precedente: ${projects[prevIndex].title}`);
        console.log('[Nav] Tasto Precedente impostato a:', projects[prevIndex].file);
    }

    if (nextBtn) {
        nextBtn.href = projects[nextIndex].file;
        nextBtn.setAttribute('title', `Successivo: ${projects[nextIndex].title}`);
        console.log('[Nav] Tasto Successivo impostato a:', projects[nextIndex].file);
    }
});
