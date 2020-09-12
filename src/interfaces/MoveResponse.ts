interface MoveResponse
{
	status: 'success' | 'error';
	reason?: string;
	errors?: number;
}
