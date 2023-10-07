import React from "react";

import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";

import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";

import { SquareChip } from "../Display.jsx";

import { ResolveCommentReportButton, RemoveCommentButton } from "../Actions/CommentButtons.jsx";
import { BanUserCommunityButton, BanUserSiteButton, PurgeUserSiteButton } from "../Actions/GenButtons.jsx";

import { PersonMetaLine, ReportDetails } from "./Common.jsx";

import { MomentAdjustedTimeAgo, SanitizedLink } from "../Display.jsx";

const CommentContentDetail = ({ report }) => {
  return (
    <Box>
      {/* Comment Meta */}
      <Typography variant="h6" component="h2" sx={{ display: "flex", gap: 1 }}>
        {report.comment.published && (
          <SquareChip color="neutral" variant="outlined" tooltip={report.comment.published}>
            <MomentAdjustedTimeAgo fromNow>{report.comment.published}</MomentAdjustedTimeAgo>
          </SquareChip>
        )}

        <SquareChip color={"primary"} tooltip="Child Comments" startDecorator={<ForumIcon />}>
          {report.counts.child_count}
        </SquareChip>

        <SquareChip color={"primary"} tooltip="Score" startDecorator={<ThumbsUpDownIcon />}>
          {report.counts.score}
        </SquareChip>

        <SquareChip color={"primary"} tooltip="Downvotes" startDecorator={<ThumbDownIcon />}>
          {report.counts.downvotes}
        </SquareChip>

        {report.comment_report.resolved && (
          <SquareChip
            color={"success"}
            variant="soft"
            tooltip={`Resolved by @${report.resolver.name}`}
            iconOnly={<DoneAllIcon fontSize="small" />}
          />
        )}

        {report.comment.removed && (
          <SquareChip color={"danger"} tooltip="Removed" iconOnly={<DeleteOutlineIcon fontSize="small" />} />
        )}

        {report.comment.deleted && (
          <SquareChip color={"danger"} tooltip="Deleted" iconOnly={<DeleteOutlineIcon fontSize="small" />} />
        )}
      </Typography>

      {/* Comment Title */}
      <Typography variant="h4" component="h2">
        {/* <Typography>
          <ForumIcon fontSize="large" />
        </Typography> */}
        <SanitizedLink href={report.comment.ap_id} target="_blank" rel="noopener noreferrer">
          Show Comment in Context
        </SanitizedLink>
      </Typography>

      <PersonMetaLine
        creator={report.comment_creator}
        by
        sx={{
          px: 1,
        }}
      />

      {/* Comment Content */}
      <Typography
        variant="body1"
        component="p"
        sx={{
          p: 1,
        }}
      >
        {report.comment.content}
      </Typography>
    </Box>
  );
};

export default function CommentListItem({ report }) {
  return (
    <Box
      sx={{
        // bottom right with flex
        pt: 0,
        display: "flex",
        flexDirection: "column",
        // justifyContent: "space-between",
        gap: 1,
        flexGrow: 1,
      }}
    >
      <CommentContentDetail report={report} />

      <ReportDetails report={report.comment_report} creator={report.creator} />

      {/* Report Actions */}
      <Box
        sx={{
          // bottom right with flex
          pt: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          {/* @ TODO SHOW FOR CREATOR? */}
          {/* <DeletePostButton report={report} /> */}
          <RemoveCommentButton report={report} />

          <BanUserCommunityButton person={report.comment_creator} community={report.community} />
          <BanUserSiteButton person={report.comment_creator} />
          <PurgeUserSiteButton person={report.comment_creator} />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <ResolveCommentReportButton report={report} />
        </Box>
      </Box>
    </Box>
  );
}
