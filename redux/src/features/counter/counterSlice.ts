// importujemy funkcje tworzącą Thunka = createAsyncThunk - żeby móc wykonywać akcji asynchroniczne
// dalej importujemy createSLicea żeby móc go utworzyć - jako argument przyjmuje obiekt który 
// ma 3/4 właściwości: name: string - dispatch wykorzystuje tą właściwość gdy tworzy action makery
// wtedy oprócz że nadaje nazwe action makera - który btw jest nazwą funkcji reducera to jeszcze
// uzupełnia swoją właściwość type: string jako type: `${name}/${reducer}`
// na końcu importujemy PayloadAction a konkretnie PayloadAction<T> - jest to typ dla action.payload
// a jako T wpisujemy wszystko to co wysyłąmy do payloada: może to być: {}, [], number, {name: string}
// string, albo jakieś stworzone przez nas typy typu: Snake, Person, Task itd.
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
// importujemy RootState żeby móć dokładnie określić jakiego typu jest nasz state bo tak naprawde
// RootState to typeof store.getState, i importujemy też AppThunk żeby móc przypisać ten typ
// do stworzonego Thunka żeby policjantowi TSowi się nie popierdoliło we łbie
import { RootState, AppThunk } from '../../app/store';
// importujemy funkcje która ma symulować asynchroniczną akcje - zwróci promisa po .5 sekundy
import { fetchCount } from './counterAPI';


// tworzymy interface naszego stata żeby ograniczać innych, bo końiec końców tylko na tym nam zależy
// żeby ograniczyć drugiego, żeby zabrać mu wolność i szczęście dlatego jasno mówimy że state 
// stworzony w tym slice musi być kórwa obiektem i musi mieć dwie wartości: value które musi być liczbą
// i status który ograniczamy jeszcze bardziej bo nie dość że ma być to string to tylko 3 z miliardów
// możliwych do utworzenia stringów są tutaj dozwolone. i chuj, nie będzie inaczej. Tak czy siak te 
// stringi będą wykorzystywane przy asynchroniczność => jeżeli asynchroniczna akcja się wgl nie
// rozpoczeła to status powinien być "idle", jeżeli się rozpoczeła ale nie skończyłą to 'loading'
// jeżeli skończyłą się i zwróciła błąd to 'failed' i nie wiem czemu nie ma czwartej czyli
// moment kiedy zakończyła się sukcesem - powinnien być jescze 'succesed'
export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

//Tworzymy tego stata żeby potem go wciśnąć do obiekto-argumentu createSlice({})
//Oczywiście zaznaczamy że ta stała jest typu powyższego interfejsu, w przciwnym wypadku
//Cała nasza próba zniewolenia ludzkości spocznie na laurach za chęci 
const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.

// wykorzystujemy tutaj zimportowaną funkcje createAsyncThunk, oczywiście nie wywołujemy jej tylko
// zapisujemy i eksportujemy - żebyśmy mogli jej użyć w odpowiednim momencie
// ponieważ jest to droga na około to musimy się przygotować w chuj to znaczy musimy wcielić się
// w dispatcha i odegrać jego role, więc w pierwszym argumencie którym jest string myślimy jaką
// nazwe na naszym miejsu wybrał by dispatch, najpierw nazwa slice a potem nazwa funkcji reducera
// czyli: 'couter/fetchCount' - uff... pierwsze poszło łatwo ale jako drugi argument o zgrozo 
// wcale nie podajemy obiektu payload... zamiast tego podajemy funkcje (to wgl chyba powód dlaczego
// sam dispatch nie obsłuży thunka), funkcja ta ma być asynchroniczna czyli ze słówkiem kluczowym
// async następnie czas na argument i jego typ => w tym wypatku padło na nazwe z dupy amount i 
// rozkazano żeby była to liczba i skoro to funkcja to przydało by się żęby miałą jakieś ciało
// a w nim do stałęj response przypisujemy zawaitowany wynik z asynchronicznej funkcji której
// wysyłamy nasz dupny argument i ona nam zwróci w sumie to samo tylko że po .5 sekundy
// i pod nazwą data dlatego z tej funkcji zwracamy response.data, ciekawi mnie czemu nie musiliśmy
// zapisać co zwraca ta funkcja... czyżby typescript poszedł na jakieś lekcje doszkalające?
export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount: number) : Promise<number> => {
    const response = await fetchCount(amount);
    // The value we return becomes the `fulfilled` action payload
    return response.data;
  }
);


// tworzymy naszego Slicea za pomocą importowanej funkcji
export const counterSlice = createSlice({
  // wymyślamy jakąś zmyślną nazwe dla naszego Slicea
  name: 'counter',
  // dodajemy mu stata żeby wiedział na czym ma operować
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  // ostatnim ważnym polem jest właściwość o nazwie reducers - jest to obiekt w którym kolekcjionujemy
  // wszystkie funkcje reducera - nwm nazwij to reducerki gdyż ani to do końca nie reducer ani nie
  // dispatch a jednak są wykorzystywane do stworzenia zarówno jednych czy raczej jednego jak i 
  // drugich
  reducers: {
    // a oto i właśnie pojedyńczy reducerek, czyli właściwość i przypisana mu funkcja, funkcja
    // ta z kolei zawsze przyjmuje stata, jakiego stata zapytacie? otóż tego którego pobierzemy
    // w useSelectorze który już wiadomo że jest typu RootState więc po co tutaj też to zaznaczać?
    // ja nie wiem ale dziwi mnie że chujek TypeScript tego nie wymaga, a więc funkcja ta zawsze 
    // przyjmuje state i co ciekawe opcjionalnie payload czyli tak naprawde action.payload czyli
    // tak naprawde action.payload: PayloadAction<{isChuj: boolean}>. No i teraz najlepsze... czyli
    // najbardziej mylące, jak wiemy i się uczyliśmy czy to state w reduxie czy w useState nie możę
    // być manipulowany, jeżeli chcemy zmienić jedną wartość w obiekcie to reste pusimy skopiować
    // poprzez {...prevState, value: prevState + 1} - tak jest było i będzie no chyba że jesteśmy w
    // środku createSlicera - ponieważ on to sobie zadecydował że będzie troche jak state class
    // komponentu i on sobie kopjuje stata zanim go zaktualizujesz a po twojej aktualizaji dokleja
    // to co ty zmieniłeś z tym co miał, wyklucza rzeczy które są ze sobą sprzeczne, sika na całość
    // dodaje troche soli i zwraca stata - tak, to wszystko robi jakiś Immer czy jakoś tak
    // jakis kutas z niemiec - nie istotne. Co nam to daje? Jeszcze większy rozpierdol w mózgy
    // ale chuj tam z nami. koniec końców jesteś zmuszony do robienia czegoś czego wcześniej
    // ci zabraniali i śmieli się z ciebie jak to przez przypadek zrobiłeś. czyli modyfikujesz
    // tylko jedną konkretną część stata wgl mając w dupie reszcze, mało tego nie zwracasz tego,
    // jeżeli zmanipulujesz stata i będziesz chciał go zwrócić to ci wyrzucą błąd, czyli poprostu
    // można powiedzieć że ty nie modyfikujesz stata, ty go poprostu hamsko nadpisujesz, wyciągasz
    // typa od rodziny na solo i beztiarsko go zabijasz, ścierwo rzucasz psom a na jego miejsce 
    // wpychasz jakiegoś randoma z ulicy i wysyłasz w zakrwawionej kurtce poprzednika zpowrotem
    // do rodziny a nsz kochany Immer przekonuje wszystkich że to ten sam człowiek
    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    // tu mamy nasz ciekawy przypadek z użyciem akcji. Ta funkcja z założenia ma dodać
    // do stata.value wartość którą sobie wybierzemy dlatego przyjmuje akcje która jest
    // jakiegoś jebanego typu PayloadAction<number> zamiast poprostu number i następnie
    // dodaje ten number do stata. Pragne tylko zauważć żę to action jest typu PayloadAction<>
    // a nie action.payload - więc co robimy jeżeli chcielibyśmy zdestrukturyzować obiekt action?
    // to już niestety tylko jeden chuj wie
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.

 // tutaj mamy reducerka który skończył szkołę wyższą - jebaniutki, nawet mi się to nie udało,
 // w każdym razie skoro jest taki mądry to napewno potrafi coś czego nie potrafią zwykłe 
 // reducerki - tempaki - otórz tak. Jak wiemy nasze reducerki pełnią trochę upośledzoną funkcje
 // czyli niby są to reducerki ale odopwiadają też troche za akcjie jednak jedej rzeczy nie potrafią
 // taki tępy reducerek nie pomieści w swoim brzuszku funkcji asynchronicznej. Dlatego wysyłąmy niektóre
 // z reduserków do szkoły żeby nauczyły się tego robić. Niestety ponieważ ogólnie cały Slice jest
 // ze starego pokolenia to i tak nie pozwoli on extra Reducerkom z dyplomem przechowywać w sobie
 // funkcji asynchroniczne - co by sąsiedzi powiedzieli, ale ponieważ nasze extraReducerki są sprytne
 // znalazły sposów na przechytrzenie niedomyślnego starego, mianowicie funkcjie asynchroniczen
 // są przechowywane na polu sąsiada, w osobnym pliku a extraReducerki odnoszą się do naszego 
 // stworzonego thunka który włąśnie wywołuje tą funkcje z pola sąsiada. No ale jak one to robią
 // ponieważ niektóre z nich skończyły kilka kierunków to logiczne że musiały wymyślić sposób przez 
 // który zarówno ich ojciec jak i my dostajemy jebniętego oczopląsu. Zacznijmy od tego że 
 // extraReducerki które btw są funkcją xD, przyjmują argument builder, ten builder to nic innego 
 // jak....
 // wydaje mi się wogule że thunk to tak naprawde obiekt który posiada w sobie właściwości
 // takie jak pending - który odpala się kiedy zaczynamy wykonywać funkcje asynchroniczną
 // a następne dwa rzucają monetą który z nich się opdali, mianowici fulfilled - odpali się
 // tylko wtedy kiedy misja się powiedzie i odbierzemy z Api nasze dane, wtedy możemy ustawić
 // status naszego stata na idle - no bo pobieranie się już zakończyło a oprócz tego możemy w
 // w state zapisać nasze dane które znajdują się w argumencie actoin, tutaj znowu nie podajemy
 // że aciton jest typu PeyloadAction<T> no ale chuj. Możliwe że zamiast niego zostanie wypchnięty
 // do przodu pole rejected => wtedy ustawiamy tylko status na 'failed' i możemy obsłużyć błąc.
 // wiadomo oczywiście że jak jest pending to zmieniamy tylko status na loading nie?
 // no ale wrócmy do naszego buildera - to poprostu jakiś chujek który umożliwia nam wykorzystać
 // swoje zdolności addCase(jako pierwszy argument wpierdalamy thunka.możliwość, a jako drugi 
 // funkcje która przyjmuje stata i opcjionalni actiona i manipuluje statem bardziej lub mniej)
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});


// Na końcu eksportujemy... no właśnie co eksportujemy, nasze reducerki? A nie kurwa... nic 
// bardziej mylnego... spójrz jaki obiekt tu destuktyryzujemy: tak actions z naszego Slicea
// jest to coś czego nawet nie tworzyliśmy, ale utworzyło się samo... tak kurwa samo,
// i jest to nic innego jak action makery które nazwały się tak samo jak reducerki bo 
// w sumie od tego jest to uzależnione
export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
// a co my tu robimy? exportujemy kórwa nasz state żeby już jebany typescript wiedział jakiego 
// jest typu. to w sumie nawet nie jest state bo my eksportujemy funkcje która przyjmuje stata
// i zwraca pole value z pola counter z tego stata. Skąd wiemy że takie pola napewno będą istnieć?
// zadba o to typ stata =? RootState - to włąśnie taki typ stata w którym te własności istnieją.
// funkcja te będzie wykorzystywana jako argument Selectorów które właśnie przyjmują funkcje
// z globalnym statem i zwracają interesującą nas pojedyńczą bardziej/lub mniej złożoną włąściwość
export const selectCount = (state: RootState) => state.counter.value;

// We can also write thunks by hand, which may contain both sync and async logic.
// Here's an example of conditionally dispatching actions based on current state.
// Ha! niespodzianka kurwa... okazuje się że można też inaczej... mało tego w jeszcze bardziej
// popierdolony sposób, czyli tworzymy thunka i odrazu w nim umieszczamy wszystko tak żeby
// nawet nie umieszczać go w Slice-u... nie ogarniam jeszcze ale chuj... dobra więc nasz
// incrementIfOdd to funkcja która przyjmuje argument typu number i zwraca AppThunka - 
// cokolwiek to oznacza - chyba to że ma te pola .pending .fulfilled . rejected - ale nie mam pewności
//w każdym razie ta jebnięta funkcja jak wiemy zwraca AppThunka i jak się okazuje AppThunk to 
// jak możemy sobie skojarzyć przecież też funkcja... czyli do zmiennej zapisujemy funkcjie która
// zwraca funkcje? Dokłądnie kurwa tak! XD jak wiemy Thunk przyjmuje dispatcha i state... 
// hahaha wiadomo? niby kurwa skąd...? pierwsze to słysze. Nasz createAsyncThunk jako argumenty
// przyjmował nazwe - chyba dla typu obiektu action i funkcje która wykonywała asynchroniczne rzeczy,
// a tu co? czemu kórwa ta funkcja przyjmuje dispatch i getState...? znaczy zacznijmy wgl od tego
// że moglibyśmy nazwać te argumenty gowno1 i gowno2 ale co jest jeszcze ciekawe... zwróc uwage co 
// robi ta jebnięta funkcja ... po pierwsze ustala aktualną wartość dla stata.counter.value
// jak? no do zmiennej zapisuje useSelec.... żaden kórwa useSelector... tylko stworzoną funkcje
// (state: RootState) => state.counter.value, jeżeli chce wykonać tą funkcje to musi mieć dostęp 
// do korzenia czyli pewnie wyrzej i tak użyje useSelectora no ale zaraz zobaczymy.
// dalej sprawdza czy liczba jest niepażysta i jeśli tak to używa przekazanego dispatch
// którego pewnie ukradł z useDispatch a jako jego argument podaje mu znany nam i również exportowany
// z naszych slice.action - action maker który dodatkowo wymaga argumentu typu number który
// zostanie wjebany do action.payload. No dobra zostało tylko zobaczyć skąd ten zlodziej
// bierze dispatcha i getStata.... dajcie mi sekunde... kórwa wychodzi na to że zwracany nam tutaj
// AppThunk który jest funkcją domyślnie posiada wszystki dispatche i getStata dzięki któremu możemy
// sobie wyciągnąć z niego interesujący nas state i wykonać dispatch(a jako argument podać którąć
// z wyrzej wymienionych funkcji a jako jej argument jeżeli takowy posiada przekazac argument z 
// pierwszej funkcji). Wniosek z tego prosty: o ile funkcjie asynchroniczne trzymaj w inny pliku to
// Thunki zatankuj w tym samym pliku co Slice żeby miały dostęp zarówno do selctCounta - które 
// moglibyśmy sobie zrobić gdzie indziej XD jak i do action makerów - które i tak exportujemy 
// i możemy odbierać gdzie indziej... a to chuj rób se thunki gdzie kurwa chcesz 
export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());
    if (currentValue % 2 === 1) {
      dispatch(incrementByAmount(amount));
    }
  };

// domyślnie zwracamy prawdziwego reducera - nie reducerki... nasz reducer jest troche
// tworzony chyba dzięki reducerkom ale chuj z tym jak w sumie on jest tworzony, najwarzniejsze
// że tak jak obiekt counterSlice.action - tworzy się automatycznie a potrzebujemy go żeby
// wepchnąć go jako jedno z wielu pól pola reducers: {} w funkcji configureStore - 
// tak naprawde to tam wpychamy pełno reducerów dzięki czemu na końcu tworzy nam się taki wielki
// skurwiel, kutas nad kutasy, składający się z wielu pomniejszych a może czasami i większych
// członków Reduceró z różnych Sliców - RootReducer AAAAAAAA!!!!
export default counterSlice.reducer;
