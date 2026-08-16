# GA4 interaction strategy

The site keeps GA4's automatic initial `page_view` and sends one manual `page_view` after each client-side route change. Custom events use stable lowercase names and descriptive parameters; they do not contain personal data.

| Event | Fires when | Useful parameters |
| --- | --- | --- |
| `scene_view` | An immersive scene route becomes active | `scene_id`, `scene_name` |
| `scene_change` | A visitor moves from one scene to another | `from_scene`, `to_scene` |
| `memory_explore` | A visitor uses next/previous, the selector, a hotspot, animation, or a keepsake | `method`, `scene_id`, `to_scene` |
| `audio_play` | Ambience starts or Spotify confirms playback | `audio_type`, `scene_id`, `playlist`, `source` |
| `audio_pause` | The visitor turns ambience off | `audio_type`, `scene_id`, `source` |
| `video_play` | An opted-in animated scene begins playing | `scene_id`, `video_type` |
| `share_click` | An article share or copy-link control is used | `content_type`, `item_id`, `method` |
| `blog_view` | A published article route becomes active | `article_slug`, `article_title`, `category` |
| `blog_to_scene_click` | A journal reader enters an immersive memory | `article_slug` or `source`, `to_scene` |
| `scene_to_blog_click` | A scene visitor opens the journal | `scene_id` or `source`, `destination` |
| `external_link_click` | A visitor follows an off-site link | `link_url`, `link_domain`, `link_text` |

## Recommended GA4 Key Events

Start with `share_click` and `blog_to_scene_click`. They represent strong advocacy and a successful editorial-to-experience journey. After two to four weeks of clean data, consider `memory_explore` as a Key Event only if the reporting objective is engaged exploration; it is intentionally broader and will occur much more often.

Do not mark `scene_view`, `scene_change`, `blog_view`, audio, video, or external-link events as Key Events by default. Use them as engagement and diagnostic signals instead.

In GA4, register high-value parameters such as `scene_id`, `method`, `article_slug`, `to_scene`, `audio_type`, and `link_domain` as event-scoped custom dimensions. Validate events in DebugView before creating audiences or changing Key Event status.
