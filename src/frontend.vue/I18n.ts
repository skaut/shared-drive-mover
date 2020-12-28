import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

export default new VueI18n({
  locale: "<?= Session.getActiveUserLocale() ?>",
  fallbackLocale: "en",
  messages: {
    en: {
      dialogs: {
        error: {
          title: "Error",
          content:
            "An unknown error occured. Please check the source folder and the destination Shared Drive and try again.",
          optionalErrorMessage: "Error message: ",
        },
      },
    },
    cs: {
      steps: {
        folderSelection: "Výběr zdrojové složky",
        sharedDriveSelection: "Výběr cílového Sdíleného disku",
        configuration: "Nastavení",
        confirmation: "Potvrzení",
        progress: "Přesun",
        done: "Hotovo",
      },
      dialogs: {
        nonEmpty: {
          title: "Sdílený disk není prázdný",
          content:
            "Vybraný cílový Sdílený disk není prázdný. Chcete přesto pokračovat?",
          confirm: "Ano",
          cancel: "Ne",
        },
        error: {
          title: "Chyba",
          content:
            "Nastala neznámá chyba. Prosím zkontrolujte zdrojovou složku a cílový Sdílený disk a zkuste to znovu.",
          optionalErrorMessage: "Chybová hláška: ",
        },
      },
      continueButton: "Pokračovat",
      moveButton: "Přesunout",
      configuration: {
        introduction:
          'Vítejte v nástroji "Shared drive mover", sloužícím k přesouvání souborů a složek z běžného Google Disku (tzv. "Můj Disk") do Sdílených disků (dříve označovaných jako Týmové disky). V následujících krocích vyberete složku a sdílený disk (nebo jeho podsložku). Obsah vybrané složky pak bude přesunut do vybraného Sdíleného disku (nebo jeho podsložky). Přesun může trvat déle, buďte prosím trpěliví.',
        description:
          "U souborů, jichž nejste vlastníkem, se místo jejich přesunutí vytvoří kopie v cílovém Sdíleném disku. V takovém případě lze nastavit několik možností:",
        copy: {
          title: "Kopírovat komentáře",
          description:
            "Zkopírovat komentáře z původních souborů. Komentáře budou vytvořeny pod vaším účtem a původní autor bude označen. Kopírování komentářů může přesun zpomalit.",
        },
      },
      confirmation: {
        description:
          'Opravdu chcete přesunout obsah složky "{folderName}" do Sdíleného disku "{sharedDriveName}"?',
      },
      done: {
        description:
          "Úspěšně přesunuto. Můžete smazat původní soubory ze svého Google Disku - některé soubory mohly být zanechány protože nemohly být smazány automaticky.",
        errorHeader: {
          text:
            "Při přesunu některých souborů se stala chyba a soubory nemohly být přesunuty. Přesuňte prosím následující soubory ručně a problémy nahlašte na {link} pokud si myslíte, že jsou chybou tohoto nástroje.",
          github: "GitHubu",
        },
        file: "Soubor",
        message: "Chybová hláška",
      },
      folderSelector: {
        myDrive: "Můj Disk",
      },
      sharedDriveSelector: {
        sharedDriveList: "Seznam Sdílených disků",
      },
    },
  },
});
