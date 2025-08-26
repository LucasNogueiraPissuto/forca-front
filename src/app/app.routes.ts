import { Routes } from '@angular/router';
import { Game } from './pages/game/game';
import { VirtualKeyBoard } from './components/virtual-key-board/virtual-key-board';
import { HomeComponent } from './pages/home/home';
import { SelecaoJogosComponent } from './components/selecao-jogos-component/selecao-jogos-component';

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path:"game",
        component: Game
    },
        {
        path:"game/:id",
        component: Game
    },
    {
        path: "selecao-jogos",
        component: SelecaoJogosComponent
    }
];
