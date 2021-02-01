<script lang="ts">
	import Welcome from "./Welcome.svelte";
	import {Pages} from "./Pages";
	import ChooseSize from "./ChooseSize.svelte";
	import {slide} from "svelte/transition"
	import InputSudoku from "./InputSudoku.svelte";
	import Solver from "./Solver.svelte";

	let l: number = 3;
	let state: Array<Array<number>> = [];
	let allAtOnce: boolean = false;

	let currentPage: Pages = Pages.Welcome;
	let changePage = (page: Pages) => {
		currentPage = page;
	};

	let setToInputSudoku = (page: Pages, length: number) => {
		l = length;
		currentPage = page;
	};

	let setToSolve = (page: Pages, State: Array<Array<number>>, allInOne: boolean) => {
		state = State;
		allAtOnce = allInOne;
		currentPage = page;
	};

</script>




<div>
	{#if currentPage === Pages.Welcome}
		<div transition:slide>
			<Welcome changePage={changePage}/>
		</div>

	{:else if currentPage === Pages.ChooseSize}
		<div transition:slide>
			<ChooseSize changePage={setToInputSudoku}/>
		</div>
	{:else if currentPage === Pages.SetSudoku}
		<div transition:slide>
			<InputSudoku length={l} changePage={setToSolve}/>
		</div>
		{:else if currentPage === Pages.Solver}
		<div transition:slide>
			<Solver allInOneGo={allAtOnce} changePage={changePage} state={state}/>
		</div>
	{/if}
</div>

