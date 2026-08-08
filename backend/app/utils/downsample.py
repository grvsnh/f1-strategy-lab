from typing import List, Any, TypeVar

T = TypeVar("T")

def downsample_list(data: List[T], max_points: int = 350) -> List[T]:
    """Uniformly downsamples list to max_points if length exceeds max_points."""
    if not data or len(data) <= max_points:
        return data
    step = len(data) / float(max_points)
    return [data[int(i * step)] for i in range(max_points)]
