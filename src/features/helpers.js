import {useCallback, useEffect, useReducer, useRef, useState} from "react";
import { URI } from './constants'

const dataFetchReducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_INIT':
			return {
				...state,
				isLoading: true,
				isError: false
			};
		case 'FETCH_SUCCESS':
			return {
				...state,
				isLoading: false,
				isError: false,
				data: action.payload,
			};
		case 'FETCH_FAILURE':
			return {
				...state,
				isLoading: false,
				isError: true,
			};
		default:
			throw new Error();
	}
};

export const useDataApi = (initialUrl, initialData, manualStart) => {
	const [url, setUrl] = useState(initialUrl);
	const controller = useRef(null)
 	const [state, dispatch] = useReducer(dataFetchReducer, {
		isLoading: false,
		isError: false,
		data: initialData,
	});

	const fetchData = useCallback(async () => {
		controller.current = new AbortController();
		const signal = controller.current.signal;
		const token = localStorage.getItem("token");

		dispatch({ type: 'FETCH_INIT' });

		try {
			const result = await fetch(
				`${URI}/${url}`,
				{
					headers: {
						Accept: "application/json",
						Authorization: `${token ? `Bearer ${token}` : ""}`,
					},
					signal,
				});

			if (result.status === 200) {
				const data = await result.json()
				dispatch({ type: 'FETCH_SUCCESS', payload: data });
				return data;
			}
		} catch (error) {
			dispatch({ type: 'FETCH_FAILURE' });
		}
	}, [url]);

	useEffect(() => {

		if (controller.current) {
			controller.current.abort();
		}

		if (!manualStart) {
			fetchData();
		}

		return () => {
			if (controller.current) {
				controller.current.abort();
			}
		};
	}, [fetchData, manualStart]);

	return [state, fetchData, setUrl];
};

export const useGetToken =  () => {
	const [state, fetcher] = useDataApi("auth/anonymous?platform=subscriptions", null, true);
	return [state , fetcher];
};

export const generateBgColorsClass = (list) => {
	const classes = ["bg-danger", "bg-success", "bg-warning", "bg-secondary"];
	const classesMap = {};

	list.forEach((item, idx) => {
		classesMap[item] = classes[idx]
	})

	return classesMap;
};

export const chunkArray = (array, chunkLength = 10) => {
	const chunkedArray = [];
	let index = 0;

	while (index < array.length) {
		chunkedArray.push(array.slice(index, index + chunkLength));
		index += chunkLength;
	}

	return chunkedArray;
}