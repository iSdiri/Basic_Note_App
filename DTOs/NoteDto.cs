namespace Basic_dotnet_API.DTOs;

public record CreateNoteDto(string Title, string Content, int UserId, int? FolderId);
public record UpdateNoteDto(string Title, string Content);
public record ReadNoteDto(int Id, string Title, string Content, DateTime CreatedAt, int UserId, int? FolderId);
