"""Compatibility entry point for the fixed-page material builder."""
import runpy
from pathlib import Path
runpy.run_path(str(Path(__file__).with_name("prepare-pages.py")), run_name="__main__")
