using Basic_dotnet_API.DTOs;
using Basic_dotnet_API.Models;

namespace Basic_dotnet_API.Mappers;

public static class NoteMapper
{
    public static ReadNoteDto ToDto(Note note) =>
        new(note.Id, note.Title, note.Content, note.CreatedAt, note.UserId, note.FolderId);

    public static Note ToModel(CreateNoteDto dto) =>
        new() { Title = dto.Title, Content = dto.Content, UserId = dto.UserId, FolderId = dto.FolderId };

    public static void UpdateModel(Note note, UpdateNoteDto dto)
    {
        note.Title = dto.Title;
        note.Content = dto.Content;
    }
}
