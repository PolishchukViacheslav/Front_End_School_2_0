import PaginationComponent from 'react-bootstrap/Pagination';

const Pagination = ({ activePage, pagesCount, setPage }) => {
	return (
		<PaginationComponent className="mt-4 justify-content-center">
			{Array.from({length: pagesCount}, (item, idx) => idx).map(idx => (
				<PaginationComponent.Item
					key={idx + 1}
					active={activePage === (idx + 1)}
					onClick={() => setPage(idx + 1)}
				>
					{idx +1}
				</PaginationComponent.Item>
			))}
		</PaginationComponent>
	);
};

export default Pagination;